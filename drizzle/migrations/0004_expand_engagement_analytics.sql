-- Privacy-conscious analytics expansion.
-- No latitude/longitude columns are added anywhere: geography is stored only as
-- neighborhood, ZIP and coarse distance buckets.

ALTER TABLE public.engagement_events
  ADD COLUMN IF NOT EXISTS subcategory text,
  ADD COLUMN IF NOT EXISTS area_type text,
  ADD COLUMN IF NOT EXISTS zip text,
  ADD COLUMN IF NOT EXISTS distance_bucket text,
  ADD COLUMN IF NOT EXISTS search_radius numeric,
  ADD COLUMN IF NOT EXISTS query_topic text,
  ADD COLUMN IF NOT EXISTS result_count integer,
  ADD COLUMN IF NOT EXISTS source_page text,
  ADD COLUMN IF NOT EXISTS referral_source text,
  ADD COLUMN IF NOT EXISTS device_type text;

CREATE INDEX IF NOT EXISTS engagement_events_event_type_idx ON public.engagement_events (event_type);
CREATE INDEX IF NOT EXISTS engagement_events_created_at_idx ON public.engagement_events (created_at);
CREATE INDEX IF NOT EXISTS engagement_events_resource_slug_idx ON public.engagement_events (resource_slug);
CREATE INDEX IF NOT EXISTS engagement_events_neighborhood_idx ON public.engagement_events (neighborhood);
CREATE INDEX IF NOT EXISTS engagement_events_query_topic_idx ON public.engagement_events (query_topic);

-- PUBLIC / PARTNER-FACING AGGREGATES ----------------------------------------

CREATE OR REPLACE FUNCTION public.analytics_overview()
RETURNS TABLE(
  resident_sessions bigint,
  return_sessions bigint,
  resource_views bigint,
  get_there_clicks bigint,
  calls_initiated bigint,
  resources_saved bigint,
  map_views bigint,
  ask_kih_questions bigint,
  external_opens bigint,
  kih_live_views bigint,
  self_reported_checkins bigint,
  verified_checkins bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(DISTINCT anonymous_session_id) FROM public.engagement_events WHERE event_type = 'session_started'),
    (SELECT count(DISTINCT anonymous_session_id) FROM public.engagement_events WHERE event_type = 'return_visit'),
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'resource_view'),
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'get_there'),
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'call_clicked'),
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'resource_saved'),
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'map_opened'),
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'ask_kih_query'),
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'external_resource_opened'),
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'kih_live_viewed'),
    (SELECT count(*) FROM public.checkins WHERE status = 'self_reported'),
    (SELECT count(*) FROM public.checkins WHERE status = 'verified');
$$;

CREATE OR REPLACE FUNCTION public.analytics_category_demand()
RETURNS TABLE(category text, events bigint, share numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH e AS (
    SELECT resource_category AS category
    FROM public.engagement_events
    WHERE resource_category IS NOT NULL
      AND event_type IN ('resource_view','category_selected','resource_saved','get_there','map_marker_selected','call_clicked')
  )
  SELECT category,
         count(*) AS events,
         round(100.0 * count(*) / NULLIF((SELECT count(*) FROM e), 0), 1) AS share
  FROM e
  GROUP BY category
  ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.analytics_location_preference()
RETURNS TABLE(gps_sessions bigint, manual_sessions bigint, average_radius_miles numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(DISTINCT anonymous_session_id) FROM public.engagement_events WHERE event_type = 'location_enabled'),
    (SELECT count(DISTINCT anonymous_session_id) FROM public.engagement_events WHERE event_type = 'manual_area_selected'),
    (SELECT round(avg(search_radius)::numeric, 1) FROM public.engagement_events WHERE search_radius IS NOT NULL);
$$;

CREATE OR REPLACE FUNCTION public.analytics_funnel()
RETURNS TABLE(stage text, events bigint, step_order integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'Discover'::text, (SELECT count(*) FROM public.engagement_events WHERE event_type = 'resource_view'), 1
  UNION ALL
  SELECT 'Interest', (SELECT count(*) FROM public.engagement_events WHERE event_type IN ('resource_saved','resource_interested')), 2
  UNION ALL
  SELECT 'Get There', (SELECT count(*) FROM public.engagement_events WHERE event_type = 'get_there'), 3
  UNION ALL
  SELECT 'Contact', (SELECT count(*) FROM public.engagement_events WHERE event_type IN ('call_clicked','external_resource_opened')), 4
  UNION ALL
  SELECT 'Participate', (SELECT count(*) FROM public.checkins), 5
  ORDER BY 3;
$$;

-- INTERNAL-ONLY AGGREGATES ---------------------------------------------------

CREATE OR REPLACE FUNCTION public.analytics_resource_performance()
RETURNS TABLE(
  resource_slug text,
  category text,
  views bigint,
  saves bigint,
  get_there bigint,
  calls bigint,
  external_opens bigint,
  self_reported_checkins bigint,
  verified_checkins bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH slugs AS (
    SELECT resource_slug FROM public.engagement_events WHERE resource_slug IS NOT NULL
    UNION
    SELECT resource_slug FROM public.checkins WHERE resource_slug IS NOT NULL
  )
  SELECT
    s.resource_slug,
    (SELECT max(resource_category) FROM public.engagement_events e WHERE e.resource_slug = s.resource_slug),
    (SELECT count(*) FROM public.engagement_events e WHERE e.resource_slug = s.resource_slug AND e.event_type = 'resource_view'),
    (SELECT count(*) FROM public.engagement_events e WHERE e.resource_slug = s.resource_slug AND e.event_type = 'resource_saved'),
    (SELECT count(*) FROM public.engagement_events e WHERE e.resource_slug = s.resource_slug AND e.event_type = 'get_there'),
    (SELECT count(*) FROM public.engagement_events e WHERE e.resource_slug = s.resource_slug AND e.event_type = 'call_clicked'),
    (SELECT count(*) FROM public.engagement_events e WHERE e.resource_slug = s.resource_slug AND e.event_type = 'external_resource_opened'),
    (SELECT count(*) FROM public.checkins c WHERE c.resource_slug = s.resource_slug AND c.status = 'self_reported'),
    (SELECT count(*) FROM public.checkins c WHERE c.resource_slug = s.resource_slug AND c.status = 'verified')
  FROM slugs s
  ORDER BY 3 DESC;
$$;

-- Neighborhood reporting suppresses any group smaller than min_sessions unique
-- anonymous residents, so an individual cannot reasonably be inferred.
CREATE OR REPLACE FUNCTION public.analytics_neighborhood_engagement(min_sessions integer DEFAULT 5)
RETURNS TABLE(neighborhood text, unique_residents bigint, events bigint, top_category text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    e.neighborhood,
    count(DISTINCT coalesce(e.anonymous_session_id, e.user_id::text)) AS unique_residents,
    count(*) AS events,
    (SELECT e2.resource_category
       FROM public.engagement_events e2
      WHERE e2.neighborhood = e.neighborhood AND e2.resource_category IS NOT NULL
      GROUP BY e2.resource_category
      ORDER BY count(*) DESC
      LIMIT 1) AS top_category
  FROM public.engagement_events e
  WHERE e.neighborhood IS NOT NULL
  GROUP BY e.neighborhood
  HAVING count(DISTINCT coalesce(e.anonymous_session_id, e.user_id::text)) >= greatest(min_sessions, 5)
  ORDER BY 3 DESC;
$$;

CREATE OR REPLACE FUNCTION public.analytics_search_demand(min_searches integer DEFAULT 3)
RETURNS TABLE(query_topic text, searches bigint, average_results numeric, resource_gap boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    query_topic,
    count(*) AS searches,
    round(avg(result_count)::numeric, 1) AS average_results,
    (avg(result_count) < 3) AS resource_gap
  FROM public.engagement_events
  WHERE event_type IN ('ask_kih_query','search_submitted') AND query_topic IS NOT NULL
  GROUP BY query_topic
  HAVING count(*) >= min_searches
  ORDER BY 2 DESC;
$$;

-- Retention: anonymous event rows older than 400 days have no further trend
-- value and are removed. Callable by trusted server code only.
CREATE OR REPLACE FUNCTION public.analytics_purge_old_events()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE removed bigint;
BEGIN
  DELETE FROM public.engagement_events WHERE created_at < now() - interval '400 days';
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION public.analytics_resource_performance() FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_neighborhood_engagement(integer) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_search_demand(integer) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_purge_old_events() FROM public, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.analytics_overview() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_category_demand() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_location_preference() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_funnel() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_resource_performance() TO service_role;
GRANT EXECUTE ON FUNCTION public.analytics_neighborhood_engagement(integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.analytics_search_demand(integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.analytics_purge_old_events() TO service_role;