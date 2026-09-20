ALTER TABLE public.engagement_events DROP CONSTRAINT IF EXISTS engagement_events_event_type_check;

ALTER TABLE public.engagement_events
  ADD CONSTRAINT engagement_events_event_type_check
  CHECK (event_type = ANY (ARRAY[
    'resource_view','get_there','category_interest',
    'session_started','return_visit','location_enabled','manual_area_selected',
    'search_submitted','ask_kih_query','category_selected','resource_saved',
    'resource_interested','map_opened','map_marker_selected','call_clicked',
    'external_resource_opened','kih_live_viewed','food_resource_viewed',
    'transportation_option_viewed','everyday_connect_opened','fast_freddy_resource_viewed'
  ]));