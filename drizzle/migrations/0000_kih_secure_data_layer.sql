-- ============ RESOURCES ============
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  address TEXT,
  city TEXT DEFAULT 'Detroit',
  state TEXT DEFAULT 'MI',
  zip TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  -- how the coordinates above were derived; neighborhood_center = approximate
  coordinate_precision TEXT NOT NULL DEFAULT 'neighborhood_center'
    CHECK (coordinate_precision IN ('street_level','neighborhood_center','unknown')),
  neighborhood TEXT,
  website_url TEXT,
  phone TEXT,
  hours TEXT,
  eligibility TEXT,
  accessibility_information TEXT,
  transportation_information TEXT,
  source_name TEXT,
  source_type TEXT,
  source_url TEXT,
  is_official BOOLEAN NOT NULL DEFAULT false,
  last_verified_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active resources are publicly readable"
  ON public.resources FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- ============ CHECK-INS ============
CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  resource_slug TEXT,
  resource_category TEXT,
  neighborhood TEXT,
  user_id UUID DEFAULT auth.uid(),
  anonymous_session_id TEXT,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('verified','self_reported')),
  verification_method TEXT NOT NULL CHECK (verification_method IN ('geolocation','resident_confirmation')),
  -- rounded distance in meters at check-in time; never raw coordinates
  distance_at_checkin INTEGER,
  source TEXT NOT NULL DEFAULT 'web',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT checkins_identity_present CHECK (user_id IS NOT NULL OR anonymous_session_id IS NOT NULL),
  CONSTRAINT checkins_method_matches_status CHECK (
    (status = 'verified' AND verification_method = 'geolocation')
    OR (status = 'self_reported' AND verification_method = 'resident_confirmation')
  )
);

-- Insert only for anon; no public read of individual check-ins.
GRANT INSERT ON public.checkins TO anon;
GRANT INSERT, SELECT ON public.checkins TO authenticated;
GRANT ALL ON public.checkins TO service_role;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone may record their own check-in"
  ON public.checkins FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL AND anonymous_session_id IS NOT NULL)
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );

CREATE POLICY "Residents read only their own check-ins"
  ON public.checkins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============ ENGAGEMENT EVENTS (views / get there / category interest) ============
CREATE TABLE public.engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('resource_view','get_there','category_interest')),
  resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  resource_slug TEXT,
  resource_category TEXT,
  neighborhood TEXT,
  user_id UUID DEFAULT auth.uid(),
  anonymous_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.engagement_events TO anon, authenticated;
GRANT ALL ON public.engagement_events TO service_role;
ALTER TABLE public.engagement_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone may record an engagement event"
  ON public.engagement_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );

-- ============ SAVED LOCATIONS (approximate areas only) ============
CREATE TABLE public.saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  label TEXT NOT NULL,
  zip TEXT,
  neighborhood TEXT,
  area_kind TEXT NOT NULL DEFAULT 'neighborhood' CHECK (area_kind IN ('zip','neighborhood')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_locations TO authenticated;
GRANT ALL ON public.saved_locations TO service_role;
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents manage their own saved areas"
  ON public.saved_locations FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============ USER PREFERENCES ============
CREATE TABLE public.user_preferences (
  user_id UUID PRIMARY KEY DEFAULT auth.uid(),
  neighborhood TEXT,
  zip TEXT,
  alert_radius_miles NUMERIC,
  interests TEXT[] NOT NULL DEFAULT '{}',
  accessibility_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  transportation_preferences TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferences TO authenticated;
GRANT ALL ON public.user_preferences TO service_role;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents manage their own preferences"
  ON public.user_preferences FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============ COMMUNITY REPORTS ============
CREATE TABLE public.community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  -- neighborhood-level only; no precise resident coordinates are accepted
  neighborhood TEXT,
  zip TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','archived')),
  corroborations INTEGER NOT NULL DEFAULT 0,
  user_id UUID DEFAULT auth.uid(),
  anonymous_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.community_reports TO anon;
GRANT SELECT, INSERT ON public.community_reports TO authenticated;
GRANT SELECT ON public.community_reports TO anon;
GRANT ALL ON public.community_reports TO service_role;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published reports are publicly readable"
  ON public.community_reports FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Residents read their own reports"
  ON public.community_reports FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone may submit a community report"
  ON public.community_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );

-- ============ PRIVACY-CONSCIOUS AGGREGATE METRICS ============
-- Security definer so totals can be read without exposing individual rows.
-- Small cells are suppressed (returned as 0) so a single resident is never identifiable.
CREATE OR REPLACE FUNCTION public.impact_totals()
RETURNS TABLE (
  resource_views BIGINT,
  get_there_clicks BIGINT,
  self_reported_checkins BIGINT,
  verified_checkins BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'resource_view'),
    (SELECT count(*) FROM public.engagement_events WHERE event_type = 'get_there'),
    (SELECT count(*) FROM public.checkins WHERE status = 'self_reported'),
    (SELECT count(*) FROM public.checkins WHERE status = 'verified');
$$;

CREATE OR REPLACE FUNCTION public.impact_by_category()
RETURNS TABLE (category TEXT, views BIGINT, checkins BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.category,
    coalesce(v.views, 0) AS views,
    coalesce(k.checkins, 0) AS checkins
  FROM (
    SELECT resource_category AS category FROM public.engagement_events WHERE resource_category IS NOT NULL
    UNION
    SELECT resource_category FROM public.checkins WHERE resource_category IS NOT NULL
  ) c
  LEFT JOIN (
    SELECT resource_category AS category, count(*) AS views
    FROM public.engagement_events WHERE event_type = 'resource_view' GROUP BY 1
  ) v ON v.category = c.category
  LEFT JOIN (
    SELECT resource_category AS category, count(*) AS checkins
    FROM public.checkins GROUP BY 1
  ) k ON k.category = c.category
  GROUP BY c.category, v.views, k.checkins
  ORDER BY 2 DESC;
$$;

REVOKE ALL ON FUNCTION public.impact_totals() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.impact_by_category() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.impact_totals() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.impact_by_category() TO anon, authenticated;