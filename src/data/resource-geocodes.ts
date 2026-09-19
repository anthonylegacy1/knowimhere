// GENERATED — verified geocodes for KIH resources. Do not hand-edit.
// Sources: OpenStreetMap/Nominatim point addresses cross-checked against the
// US Census Geocoder. Resources without a street address keep neighborhood centers.

export type CoordinateAccuracy = "point_address" | "interpolated" | "neighborhood_centroid";

export interface ResourceGeocode {
  lat: number;
  lon: number;
  routableLat?: number;
  routableLon?: number;
  accuracy: CoordinateAccuracy;
  source: string;
  reviewStatus: string;
}

export const RESOURCE_GEOCODES: Record<string, ResourceGeocode> = {
  "block-club-meeting": { lat: 42.3156194, lon: -83.0923863, routableLat: 42.315628659143, routableLon: -83.092430554279, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "career-exploration": { lat: 42.3232584, lon: -83.0884539, routableLat: 42.32325222594, routableLon: -83.088397773313, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "college-fafsa": { lat: 42.3232584, lon: -83.0884539, routableLat: 42.32325222594, routableLon: -83.088397773313, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "community-social": { lat: 42.3813896, lon: -83.0806548, routableLat: 42.381333825942, routableLon: -83.080653895767, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "cooling-center": { lat: 42.3089281, lon: -83.137116, routableLat: 42.30894563289, routableLon: -83.137091294061, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "daytime-training": { lat: 42.422234862131, lon: -83.170288371924, routableLat: 42.422234862131, routableLon: -83.170288371924, accuracy: "interpolated", source: "us_census_geocoder (TIGER line interpolation)", reviewStatus: "review_recommended" },
  "digital-skills": { lat: 42.3813896, lon: -83.0806548, routableLat: 42.381333825942, routableLon: -83.080653895767, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "food-distribution": { lat: 42.3156194, lon: -83.0923863, routableLat: 42.315628659143, routableLon: -83.092430554279, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "home-repair": { lat: 42.422234862131, lon: -83.170288371924, routableLat: 42.422234862131, routableLon: -83.170288371924, accuracy: "interpolated", source: "us_census_geocoder (TIGER line interpolation)", reviewStatus: "review_recommended" },
  "part-time-openings": { lat: 42.422234862131, lon: -83.170288371924, routableLat: 42.422234862131, routableLon: -83.170288371924, accuracy: "interpolated", source: "us_census_geocoder (TIGER line interpolation)", reviewStatus: "review_recommended" },
  "riverwalk-walk": { lat: 42.328496791482, lon: -83.044329255594, routableLat: 42.328496791482, routableLon: -83.044329255594, accuracy: "interpolated", source: "us_census_geocoder (TIGER line interpolation)", reviewStatus: "review_recommended" },
  "senior-fitness": { lat: 42.3089281, lon: -83.137116, routableLat: 42.30894563289, routableLon: -83.137091294061, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "summer-youth-jobs": { lat: 42.2735847, lon: -83.157191, routableLat: 42.273491319288, routableLon: -83.157996915595, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "teen-afterschool": { lat: 42.3232584, lon: -83.0884539, routableLat: 42.32325222594, routableLon: -83.088397773313, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "tutoring": { lat: 42.3232584, lon: -83.0884539, routableLat: 42.32325222594, routableLon: -83.088397773313, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "volunteer-corps": { lat: 42.3156194, lon: -83.0923863, routableLat: 42.315628659143, routableLon: -83.092430554279, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "wellness-screening": { lat: 42.3089281, lon: -83.137116, routableLat: 42.30894563289, routableLon: -83.137091294061, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "work-after-55": { lat: 42.3813896, lon: -83.0806548, routableLat: 42.381333825942, routableLon: -83.080653895767, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "workforce-training": { lat: 42.422234862131, lon: -83.170288371924, routableLat: 42.422234862131, routableLon: -83.170288371924, accuracy: "interpolated", source: "us_census_geocoder (TIGER line interpolation)", reviewStatus: "review_recommended" },
  "youth-basketball": { lat: 42.2735847, lon: -83.157191, routableLat: 42.273491319288, routableLon: -83.157996915595, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "youth-mentoring": { lat: 42.3156194, lon: -83.0923863, routableLat: 42.315628659143, routableLon: -83.092430554279, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "jefferson-hub": { lat: 42.346309, lon: -83.0683381, routableLat: 42.346286937097, routableLon: -83.068326634092, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "bamboo-midtown": { lat: 42.346309, lon: -83.0683381, routableLat: 42.346286937097, routableLon: -83.068326634092, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "prosperus-detroit": { lat: 42.346309, lon: -83.0683381, routableLat: 42.346286937097, routableLon: -83.068326634092, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "the-source-semi": { lat: 42.346309, lon: -83.0683381, routableLat: 42.346286937097, routableLon: -83.068326634092, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "cleary-detroit": { lat: 42.346309, lon: -83.0683381, routableLat: 42.346286937097, routableLon: -83.068326634092, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "st-patrick-senior-center": { lat: 42.3481964, lon: -83.0603026, routableLat: 42.348393885493, routableLon: -83.059173363811, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "hannan-center": { lat: 42.355688, lon: -83.0630747, routableLat: 42.355295923875, routableLon: -83.063281605701, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "helping-hands-training": { lat: 42.3491623, lon: -83.0528105, routableLat: 42.349308101505, routableLon: -83.053165699793, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "selden-courtyard": { lat: 42.3472796, lon: -83.0651594, routableLat: 42.34726525707, routableLon: -83.065109147341, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "redmond-park": { lat: 42.347421823057, lon: -83.064415580107, routableLat: 42.347421823057, routableLon: -83.064415580107, accuracy: "interpolated", source: "us_census_geocoder (street intersection)", reviewStatus: "review_recommended" },
  "ff-adams-butzel": { lat: 42.3952241, lon: -83.1639995, routableLat: 42.395199478301, routableLon: -83.163919047086, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "ff-sheffield-bridge": { lat: 42.369326, lon: -83.140212, routableLat: 42.369323490945, routableLon: -83.140270260787, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "ff-chandler-park": { lat: 42.3944863, lon: -82.9771997, routableLat: 42.394508689064, routableLon: -82.97722154359, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "ff-oak-street-jefferson": { lat: 42.3664658, lon: -82.9714995, routableLat: 42.366495390876, routableLon: -82.971499693553, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
  "ff-the-office": { lat: 42.4417561, lon: -83.1419696, routableLat: 42.441708743783, routableLon: -83.141933701347, accuracy: "point_address", source: "osm_nominatim (point address), cross-checked with us_census_geocoder", reviewStatus: "reviewed_ok" },
};

/** Street-verified coordinates are precise enough for location-verified check-in. */
export function isStreetVerified(slug: string): boolean {
  return RESOURCE_GEOCODES[slug]?.accuracy === "point_address";
}
