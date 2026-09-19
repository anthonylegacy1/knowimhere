ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS address_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS coordinate_accuracy text,
  ADD COLUMN IF NOT EXISTS coordinate_source text,
  ADD COLUMN IF NOT EXISTS routable_latitude double precision,
  ADD COLUMN IF NOT EXISTS routable_longitude double precision,
  ADD COLUMN IF NOT EXISTS last_geocoded_at timestamptz,
  ADD COLUMN IF NOT EXISTS manual_review_status text NOT NULL DEFAULT 'not_reviewed',
  ADD COLUMN IF NOT EXISTS fallback_latitude double precision,
  ADD COLUMN IF NOT EXISTS fallback_longitude double precision;

UPDATE public.resources
  SET fallback_latitude = latitude,
      fallback_longitude = longitude
  WHERE fallback_latitude IS NULL AND latitude IS NOT NULL;

ALTER TABLE public.resources
  ADD CONSTRAINT resources_coordinate_accuracy_check
  CHECK (coordinate_accuracy IS NULL OR coordinate_accuracy IN ('rooftop','point_address','parcel','interpolated','approximate','neighborhood_centroid','city_centroid','street_only'));

ALTER TABLE public.resources
  ADD CONSTRAINT resources_manual_review_status_check
  CHECK (manual_review_status IN ('not_reviewed','review_recommended','reviewed_ok','geocode_failed','not_geocodable'));