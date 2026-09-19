-- Default schema grants are broad on this project; narrow them so RLS is not the
-- only barrier in front of private resident data.
REVOKE ALL ON public.checkins FROM anon;
GRANT INSERT ON public.checkins TO anon;
REVOKE UPDATE, DELETE ON public.checkins FROM authenticated;

REVOKE ALL ON public.engagement_events FROM anon, authenticated;
GRANT INSERT ON public.engagement_events TO anon, authenticated;

REVOKE ALL ON public.user_preferences FROM anon;
REVOKE ALL ON public.saved_locations FROM anon;

REVOKE ALL ON public.community_reports FROM anon;
GRANT SELECT, INSERT ON public.community_reports TO anon;

REVOKE INSERT, UPDATE, DELETE ON public.resources FROM anon, authenticated;