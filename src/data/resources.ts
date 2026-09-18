// Realistic Detroit demonstration data. All organizations, times and distances
// are prototype data created for the Venture 313 Buildathon unless noted.

export type CategoryId =
  | "health"
  | "senior"
  | "community"
  | "recreation"
  | "food"
  | "employment"
  | "youth"
  | "transportation"
  | "neighborhood"
  | "housing"
  | "technology"
  | "arts"
  | "education"
  | "events";

export const CATEGORIES: Record<CategoryId, { label: string; emoji: string; tone: string }> = {
  health: { label: "Health & Wellness", emoji: "❤️", tone: "mint" },
  senior: { label: "Senior Programs", emoji: "🌼", tone: "sun" },
  community: { label: "Community Activities", emoji: "🤝", tone: "brand" },
  recreation: { label: "Recreation", emoji: "🏀", tone: "sky" },
  food: { label: "Food Resources", emoji: "🥬", tone: "mint" },
  employment: { label: "Employment & Training", emoji: "💼", tone: "plum" },
  youth: { label: "Youth & Family", emoji: "🎓", tone: "sky" },
  transportation: { label: "Transportation", emoji: "🚌", tone: "sky" },
  neighborhood: { label: "Neighborhood Information", emoji: "🏘️", tone: "brand" },
  housing: { label: "Housing Resources", emoji: "🏠", tone: "plum" },
  technology: { label: "Technology", emoji: "📱", tone: "sky" },
  arts: { label: "Arts & Culture", emoji: "🎵", tone: "plum" },
  education: { label: "Education", emoji: "📚", tone: "sun" },
  events: { label: "Local Events", emoji: "🎉", tone: "brand" },
};

export type TransportMode =
  | "drive"
  | "transit"
  | "ride-assist"
  | "family"
  | "walking"
  | "rideshare"
  | "accessible";

export const TRANSPORT_OPTIONS: { id: TransportMode; label: string }[] = [
  { id: "drive", label: "I drive" },
  { id: "transit", label: "Public transit" },
  { id: "ride-assist", label: "Need ride assistance" },
  { id: "family", label: "Family / caregiver transportation" },
  { id: "walking", label: "Walking" },
  { id: "rideshare", label: "Rideshare" },
  { id: "accessible", label: "Prefer accessible transportation" },
];

export type AccessPref = "large-text" | "minimal-walking" | "wheelchair" | "simple" | "video";

export const ACCESS_OPTIONS: { id: AccessPref; label: string }[] = [
  { id: "large-text", label: "Large text" },
  { id: "minimal-walking", label: "Minimal walking" },
  { id: "wheelchair", label: "Wheelchair accessible" },
  { id: "simple", label: "Prefer simple instructions" },
  { id: "video", label: "Prefer video guidance" },
];

export const AGE_RANGES = ["Under 18", "18–24", "25–44", "45–64", "65+"] as const;

export const NEIGHBORHOODS = [
  "Downtown",
  "Midtown",
  "Corktown",
  "Southwest Detroit",
  "North End",
  "East English Village",
  "Jefferson Chalmers",
  "Osborn",
  "Brightmoor",
  "Rosedale Park",
  "Bagley",
  "Palmer Park",
  "Morningside",
  "Islandview",
  "Warrendale",
  "Cody Rouge",
];

export type When = "today" | "tomorrow" | "this-week" | "ongoing" | "weekend";

export interface Resource {
  id: string;
  name: string;
  category: CategoryId;
  tags: CategoryId[];
  organization: string;
  summary: string;
  description: string;
  distanceMiles: number;
  when: When;
  whenLabel: string;
  cost: "Free" | "Low cost" | "Varies";
  location: string;
  neighborhood: string;
  accessibility: string[];
  transportation: string[];
  transitFriendly: boolean;
  walkable: boolean;
  seniorFriendly: boolean;
  youthFriendly: boolean;
  isOfficialResource?: boolean;
  nextStep: string;
}

export const RESOURCES: Resource[] = [
  {
    id: "wellness-screening",
    name: "Free Wellness Screening",
    category: "health",
    tags: ["health", "senior"],
    organization: "Community Health Partners (prototype)",
    summary: "Blood pressure, glucose and vision checks. Walk in, no appointment.",
    description:
      "A drop-in wellness screening hosted at Patton Recreation Center. Nurses check blood pressure, blood sugar and basic vision, and can connect you with follow-up care if needed. Bring a photo ID if you have one; it is not required.",
    distanceMiles: 0.8,
    when: "today",
    whenLabel: "Today • 10 AM – 2 PM",
    cost: "Free",
    location: "Patton Recreation Center, 2301 Woodmere St",
    neighborhood: "Southwest Detroit",
    accessibility: ["Wheelchair accessible", "Seating available", "Large-print materials"],
    transportation: ["Bus stop 1 block away", "Community ride eligible"],
    transitFriendly: true,
    walkable: true,
    seniorFriendly: true,
    youthFriendly: false,
    nextStep: "Just show up during open hours.",
  },
  {
    id: "ride-assistance",
    name: "Transportation Assistance",
    category: "transportation",
    tags: ["transportation", "senior", "health"],
    organization: "Neighborhood Ride Network (prototype)",
    summary: "Door-to-door rides to appointments and community activities.",
    description:
      "Residents who do not drive can request a ride to medical appointments, recreation centers and community programs. Rides are scheduled a day ahead. Accessible vans are available on request.",
    distanceMiles: 0,
    when: "ongoing",
    whenLabel: "Available in your area • Book 1 day ahead",
    cost: "Free",
    location: "Serves Southwest, Corktown and Downtown",
    neighborhood: "Southwest Detroit",
    accessibility: ["Accessible van available", "Door-to-door"],
    transportation: ["Phone or app booking"],
    transitFriendly: true,
    walkable: false,
    seniorFriendly: true,
    youthFriendly: false,
    nextStep: "Request a ride and choose a pickup time.",
  },
  {
    id: "community-social",
    name: "Community Social & Live Music",
    category: "arts",
    tags: ["arts", "community", "senior", "events"],
    organization: "Fast Freddy Experience",
    summary: "An afternoon of Motown, line dancing and light refreshments. All ages welcome.",
    description:
      "The Fast Freddy Experience brings live music, movement and community together. Come for the music, stay for the conversation. Seating and step-free entry available.",
    distanceMiles: 1.2,
    when: "tomorrow",
    whenLabel: "Tomorrow • 1 PM – 4 PM",
    cost: "Free",
    location: "Considine Little Rock Family Life Center, 8904 Woodward Ave",
    neighborhood: "North End",
    accessibility: ["Step-free entry", "Seating available"],
    transportation: ["On Woodward bus + QLINE", "Community ride eligible"],
    transitFriendly: true,
    walkable: false,
    seniorFriendly: true,
    youthFriendly: true,
    nextStep: "No sign-up needed. Tap Get There to plan your trip.",
  },
  {
    id: "workforce-training",
    name: "Skilled Trades Pre-Apprenticeship",
    category: "employment",
    tags: ["employment", "education"],
    organization: "Detroit at Work partner program (prototype listing)",
    summary: "Paid 6-week training for construction and electrical pathways. Applications open this week.",
    description:
      "A paid pre-apprenticeship program preparing Detroit residents for skilled-trade careers. Includes OSHA certification, tools and job placement support. Verify eligibility with the provider.",
    distanceMiles: 2.4,
    when: "this-week",
    whenLabel: "Applications open this week",
    cost: "Free",
    location: "Northwest Activities Center, 18100 Meyers Rd",
    neighborhood: "Bagley",
    accessibility: ["Wheelchair accessible"],
    transportation: ["Bus routes 16 and 17", "Parking available"],
    transitFriendly: true,
    walkable: false,
    seniorFriendly: false,
    youthFriendly: true,
    nextStep: "Review eligibility, then start an application.",
  },
  {
    id: "neighborhood-reporting",
    name: "Report a Neighborhood Concern",
    category: "neighborhood",
    tags: ["neighborhood"],
    organization: "City of Detroit — Improve Detroit (official resource)",
    summary: "Report dumping, streetlights, potholes or property concerns to the right City department.",
    description:
      "Improve Detroit is the City of Detroit's official tool for reporting non-emergency neighborhood issues. Know I'm Here helps you identify the right category and then sends you to the official resource.",
    distanceMiles: 0,
    when: "ongoing",
    whenLabel: "Available anytime",
    cost: "Free",
    location: "Online / phone",
    neighborhood: "Citywide",
    accessibility: ["Phone option available"],
    transportation: [],
    transitFriendly: true,
    walkable: true,
    seniorFriendly: true,
    youthFriendly: true,
    isOfficialResource: true,
    nextStep: "Continue to the official reporting resource.",
  },
  {
    id: "food-distribution",
    name: "Community Food Distribution",
    category: "food",
    tags: ["food", "community"],
    organization: "Gleaners partner site (prototype listing)",
    summary: "Fresh produce and pantry staples. Drive-through and walk-up lines.",
    description:
      "Monthly food distribution with fresh produce, dairy and shelf-stable goods. No documentation required. Volunteers can carry boxes to your car or bus stop.",
    distanceMiles: 1.5,
    when: "weekend",
    whenLabel: "Saturday • 9 AM – 12 PM",
    cost: "Free",
    location: "Clark Park, 1130 Clark St",
    neighborhood: "Southwest Detroit",
    accessibility: ["Walk-up line", "Carry assistance"],
    transportation: ["Bus routes 27 and 49", "Drive-through option"],
    transitFriendly: true,
    walkable: true,
    seniorFriendly: true,
    youthFriendly: true,
    nextStep: "Arrive during open hours. Bring a bag or cart if you can.",
  },
  {
    id: "teen-afterschool",
    name: "After-School Design & Robotics Lab",
    category: "youth",
    tags: ["youth", "education", "technology"],
    organization: "Detroit Public Library — Teen HYPE partner (prototype)",
    summary: "Free after-school program for ages 13–18. Robotics, 3D design and homework help.",
    description:
      "Teens explore robotics, coding and digital design with mentors. Snacks provided. Open lab hours run Monday–Thursday.",
    distanceMiles: 1.1,
    when: "this-week",
    whenLabel: "Mon–Thu • 3:30 PM – 6 PM",
    cost: "Free",
    location: "Bowen Branch Library, 3648 W Vernor Hwy",
    neighborhood: "Southwest Detroit",
    accessibility: ["Wheelchair accessible"],
    transportation: ["On Vernor bus line", "Walkable from Western High"],
    transitFriendly: true,
    walkable: true,
    seniorFriendly: false,
    youthFriendly: true,
    nextStep: "Drop in, or register online for the full session.",
  },
  {
    id: "senior-fitness",
    name: "Gentle Movement for Seniors",
    category: "senior",
    tags: ["senior", "health", "recreation"],
    organization: "Detroit Parks & Recreation (prototype listing)",
    summary: "Chair yoga and light stretching led by a certified instructor. Beginners welcome.",
    description:
      "A low-impact class designed for adults 55+. Focus on balance, flexibility and breathing. Chairs provided; no equipment needed.",
    distanceMiles: 0.8,
    when: "tomorrow",
    whenLabel: "Tomorrow • 11 AM",
    cost: "Free",
    location: "Patton Recreation Center, 2301 Woodmere St",
    neighborhood: "Southwest Detroit",
    accessibility: ["Seated option", "Wheelchair accessible", "Minimal walking"],
    transportation: ["Bus stop 1 block away", "Community ride eligible"],
    transitFriendly: true,
    walkable: true,
    seniorFriendly: true,
    youthFriendly: false,
    nextStep: "Show up 10 minutes early to sign in.",
  },
  {
    id: "home-repair",
    name: "Home Repair Assistance Intake",
    category: "housing",
    tags: ["housing", "senior"],
    organization: "Detroit home-repair program partner (prototype listing)",
    summary: "Help with roofs, furnaces and critical repairs for eligible homeowners.",
    description:
      "An intake session for Detroit homeowners seeking help with roof, furnace, plumbing or accessibility repairs. Staff review eligibility and walk through the application. Bring proof of ownership if possible.",
    distanceMiles: 2.0,
    when: "this-week",
    whenLabel: "Thursday • 10 AM – 3 PM",
    cost: "Free",
    location: "Northwest Activities Center, 18100 Meyers Rd",
    neighborhood: "Bagley",
    accessibility: ["Wheelchair accessible", "Interpreter on request"],
    transportation: ["Bus routes 16 and 17", "Parking available"],
    transitFriendly: true,
    walkable: false,
    seniorFriendly: true,
    youthFriendly: false,
    nextStep: "Attend intake, or call to schedule a phone review.",
  },
  {
    id: "digital-skills",
    name: "Smartphone Confidence Class",
    category: "technology",
    tags: ["technology", "senior", "education"],
    organization: "Everyday Connect",
    summary: "Learn QR codes, maps, video calls and staying safe online — on the phone you already own.",
    description:
      "A friendly small-group class from Everyday Connect. Bring your own phone. Topics include maps and transit apps, QR codes, video calling family, and spotting scams.",
    distanceMiles: 1.2,
    when: "this-week",
    whenLabel: "Wednesday • 1 PM",
    cost: "Free",
    location: "Considine Little Rock Family Life Center, 8904 Woodward Ave",
    neighborhood: "North End",
    accessibility: ["Large-print handouts", "Seating available", "Simple instructions"],
    transportation: ["On Woodward bus + QLINE"],
    transitFriendly: true,
    walkable: false,
    seniorFriendly: true,
    youthFriendly: false,
    nextStep: "Reserve a seat — classes fill up.",
  },
  {
    id: "riverwalk-walk",
    name: "Riverwalk Community Walk",
    category: "recreation",
    tags: ["recreation", "community", "health", "events"],
    organization: "Detroit Riverfront Conservancy (prototype listing)",
    summary: "A relaxed group walk along the Detroit Riverwalk. Go at your own pace.",
    description:
      "Meet at Hart Plaza for a guided community walk along the river. Multiple distances offered, including a short accessible loop with benches along the way.",
    distanceMiles: 3.1,
    when: "weekend",
    whenLabel: "Saturday • 9 AM",
    cost: "Free",
    location: "Hart Plaza, 1 Hart Plaza",
    neighborhood: "Downtown",
    accessibility: ["Paved accessible path", "Benches along route"],
    transportation: ["Many bus routes + People Mover", "Paid parking nearby"],
    transitFriendly: true,
    walkable: false,
    seniorFriendly: true,
    youthFriendly: true,
    nextStep: "Just show up. Water provided.",
  },
  {
    id: "summer-youth-jobs",
    name: "Summer Youth Employment Info Session",
    category: "youth",
    tags: ["youth", "employment"],
    organization: "Grow Detroit's Young Talent (prototype listing)",
    summary: "Learn how teens and young adults 14–24 can apply for paid summer jobs.",
    description:
      "Information session covering applications, documents needed and job categories for the summer youth employment program. Parents welcome.",
    distanceMiles: 1.8,
    when: "this-week",
    whenLabel: "Tuesday • 5:30 PM",
    cost: "Free",
    location: "Kemeny Recreation Center, 2260 S Fort St",
    neighborhood: "Southwest Detroit",
    accessibility: ["Wheelchair accessible"],
    transportation: ["Bus route 27"],
    transitFriendly: true,
    walkable: false,
    seniorFriendly: false,
    youthFriendly: true,
    nextStep: "Attend the session, then apply online.",
  },
  {
    id: "cooling-center",
    name: "Cooling Center — Open Today",
    category: "neighborhood",
    tags: ["neighborhood", "health", "senior"],
    organization: "Detroit Parks & Recreation (prototype listing)",
    summary: "Air-conditioned recreation center open to the public during the heat advisory.",
    description:
      "During heat advisories, recreation centers open as cooling centers. Water, seating and restrooms available. Pets are not permitted except service animals.",
    distanceMiles: 0.8,
    when: "today",
    whenLabel: "Today • 9 AM – 8 PM",
    cost: "Free",
    location: "Patton Recreation Center, 2301 Woodmere St",
    neighborhood: "Southwest Detroit",
    accessibility: ["Wheelchair accessible", "Seating available"],
    transportation: ["Bus stop 1 block away", "Community ride eligible"],
    transitFriendly: true,
    walkable: true,
    seniorFriendly: true,
    youthFriendly: true,
    nextStep: "Walk in during open hours.",
  },
  {
    id: "block-club-meeting",
    name: "Neighborhood Block Club Meeting",
    category: "community",
    tags: ["community", "neighborhood"],
    organization: "Hubbard Farms Block Club (prototype listing)",
    summary: "Monthly meeting on street lighting, park upkeep and the fall cleanup.",
    description:
      "Neighbors meet to plan the fall cleanup, hear a District 6 update and discuss street-lighting requests. Light refreshments. Everyone on the block is welcome.",
    distanceMiles: 0.5,
    when: "this-week",
    whenLabel: "Thursday • 6:30 PM",
    cost: "Free",
    location: "Clark Park Field House, 1130 Clark St",
    neighborhood: "Southwest Detroit",
    accessibility: ["Step-free entry"],
    transportation: ["Walkable", "Bus routes 27 and 49"],
    transitFriendly: true,
    walkable: true,
    seniorFriendly: true,
    youthFriendly: true,
    nextStep: "Just show up. Bring a neighbor.",
  },
];

export const getResource = (id: string) => RESOURCES.find((r) => r.id === id);

// ---- My Neighborhood updates ----
export type UpdateKind = "important" | "community" | "city";
export interface NeighborhoodUpdate {
  id: string;
  title: string;
  detail: string;
  kind: UpdateKind;
  when: "today" | "this-week";
  emoji: string;
  neighborhood: string;
  resourceId?: string;
}

export const NEIGHBORHOOD_UPDATES: NeighborhoodUpdate[] = [
  {
    id: "heat",
    title: "Heat advisory — cooling centers open",
    detail: "Patton and Kemeny recreation centers are open as cooling centers until 8 PM.",
    kind: "important",
    when: "today",
    emoji: "☀️",
    neighborhood: "Southwest Detroit",
    resourceId: "cooling-center",
  },
  {
    id: "road",
    title: "Vernor Hwy lane closure",
    detail: "Water main work between Clark and Junction through Friday. Expect bus delays on route 27.",
    kind: "city",
    when: "this-week",
    emoji: "🚧",
    neighborhood: "Southwest Detroit",
  },
  {
    id: "blockclub",
    title: "Block club meeting Thursday",
    detail: "Fall cleanup planning and District 6 update at Clark Park Field House, 6:30 PM.",
    kind: "community",
    when: "this-week",
    emoji: "🤝",
    neighborhood: "Southwest Detroit",
    resourceId: "block-club-meeting",
  },
  {
    id: "rec",
    title: "Patton Rec Center: pool reopens Saturday",
    detail: "Open swim resumes with new weekend hours. Senior swim Tuesdays and Thursdays at 9 AM.",
    kind: "community",
    when: "this-week",
    emoji: "🏊",
    neighborhood: "Southwest Detroit",
  },
  {
    id: "health-notice",
    title: "Free flu shots at the wellness screening",
    detail: "Flu vaccines added to today's screening at Patton Recreation Center while supplies last.",
    kind: "important",
    when: "today",
    emoji: "💉",
    neighborhood: "Southwest Detroit",
    resourceId: "wellness-screening",
  },
  {
    id: "youth",
    title: "Robotics lab has open seats",
    detail: "The after-school Design & Robotics Lab at Bowen Library added a second cohort.",
    kind: "community",
    when: "this-week",
    emoji: "🤖",
    neighborhood: "Southwest Detroit",
    resourceId: "teen-afterschool",
  },
  {
    id: "trash",
    title: "Bulk pickup week",
    detail: "Bulk items and yard waste collected on your regular day this week. Set out by 7 AM.",
    kind: "city",
    when: "this-week",
    emoji: "🗑️",
    neighborhood: "Southwest Detroit",
  },
  {
    id: "safety",
    title: "Community safety resource fair",
    detail: "Meet neighborhood police officers, violence-prevention groups and youth mentors. Saturday at Clark Park.",
    kind: "community",
    when: "this-week",
    emoji: "🌳",
    neighborhood: "Southwest Detroit",
  },
];

// ---- Issue routing (prototype) ----
export interface IssueType {
  id: string;
  label: string;
  emoji: string;
  keywords: string[];
  response: string;
  resourceName: string;
}

export const ISSUE_TYPES: IssueType[] = [
  {
    id: "dumping",
    label: "Illegal dumping",
    emoji: "🗑️",
    keywords: ["dump", "trash", "garbage pile", "debris", "tires", "littering"],
    response:
      "This sounds like an illegal-dumping issue. I can help you find the appropriate Detroit reporting resource.",
    resourceName: "Improve Detroit — Illegal Dumping",
  },
  {
    id: "streetlight",
    label: "Broken streetlight",
    emoji: "💡",
    keywords: ["streetlight", "street light", "light out", "dark street", "lamp"],
    response:
      "This sounds like a streetlight outage. Detroit's Public Lighting Authority handles streetlight repairs. I can point you to the right place to report it.",
    resourceName: "Public Lighting Authority — Report an Outage",
  },
  {
    id: "abandoned",
    label: "Abandoned property",
    emoji: "🏚️",
    keywords: ["abandoned", "vacant house", "open house", "squat", "blight"],
    response:
      "This sounds like an abandoned or open property concern. I can help you reach the City's property reporting resource.",
    resourceName: "Improve Detroit — Abandoned Vehicle / Property",
  },
  {
    id: "road",
    label: "Road concern",
    emoji: "🕳️",
    keywords: ["pothole", "road", "street damage", "flooding", "sinkhole"],
    response:
      "This sounds like a road concern. Potholes and street damage can be reported to the City's Department of Public Works.",
    resourceName: "Improve Detroit — Potholes / Street Repair",
  },
  {
    id: "sidewalk",
    label: "Unsafe sidewalk",
    emoji: "🚶",
    keywords: ["sidewalk", "curb", "crosswalk", "trip"],
    response:
      "This sounds like a sidewalk safety concern. I can help you find the right City reporting category.",
    resourceName: "Improve Detroit — Sidewalk Concern",
  },
  {
    id: "garbage",
    label: "Missed garbage pickup",
    emoji: "🚛",
    keywords: ["missed pickup", "garbage", "recycling", "bulk", "trash not picked"],
    response:
      "This sounds like a missed collection. Missed garbage, recycling and bulk pickups can be reported to the City.",
    resourceName: "Improve Detroit — Missed Pickup",
  },
  {
    id: "public-space",
    label: "Damaged public space",
    emoji: "🌳",
    keywords: ["park", "playground", "bench", "graffiti", "vandal"],
    response:
      "This sounds like a damaged park or public space. I can connect you with the right Parks & Recreation reporting resource.",
    resourceName: "Improve Detroit — Park Maintenance",
  },
];

export const EMERGENCY_KEYWORDS = [
  "emergency",
  "911",
  "gun",
  "shooting",
  "shot",
  "fire ",
  "on fire",
  "bleeding",
  "heart attack",
  "not breathing",
  "overdose",
  "unconscious",
  "attack",
  "being followed",
  "break in",
  "breaking in",
];

// ---- Video guidance placeholders ----
export const VIDEOS = [
  { id: "welcome", title: "Welcome to Know I'm Here", length: "1:30", emoji: "👋" },
  { id: "find", title: "How to Find Resources", length: "2:00", emoji: "🔎" },
  { id: "recs", title: "How Recommendations Work", length: "1:45", emoji: "✨" },
  { id: "transport", title: "How Transportation Assistance Works", length: "2:10", emoji: "🚌" },
  { id: "checkin", title: "How to Use I'm Here Check-In", length: "1:20", emoji: "✅" },
  { id: "report", title: "How to Report a Neighborhood Issue", length: "1:50", emoji: "🏘️" },
  { id: "stay", title: "Staying Connected to Your Community", length: "1:40", emoji: "🔗" },
];

// ---- Rise Higher Detroit priorities ----
export const PRIORITIES = [
  {
    title: "Thriving Neighborhoods",
    emoji: "🏘️",
    items: ["Housing resources", "Food access", "Neighborhood services", "Community spaces", "Arts and activities"],
  },
  {
    title: "Safe and Just Communities",
    emoji: "🤝",
    items: ["Prevention resources", "Youth opportunities", "Neighborhood support", "Crisis resources", "Community information"],
  },
  {
    title: "Transportation & Infrastructure",
    emoji: "🚌",
    items: ["Transit", "Ride options", "Accessibility", "Road information", "Mobility assistance"],
  },
  {
    title: "Economic & Workforce Development",
    emoji: "💼",
    items: ["Jobs", "Training", "Certifications", "Small-business support", "Career pathways"],
  },
  {
    title: "Education & Youth",
    emoji: "🎓",
    items: ["After-school programs", "Summer opportunities", "Mentoring", "Sports", "Career programs"],
  },
  {
    title: "Accessible Government",
    emoji: "🏛️",
    items: ["City services", "Reporting resources", "Programs", "Public information", "Help finding the correct department"],
  },
];

// ---- Demo persona ----
export const DEMO_PROFILE = {
  name: "Dorothy",
  neighborhood: "Southwest Detroit",
  ageRange: "65+" as const,
  interests: ["health", "arts", "community", "senior"] as CategoryId[],
  transportation: ["transit", "ride-assist"] as TransportMode[],
  accessibility: ["simple", "minimal-walking"] as AccessPref[],
  lowCost: true,
};

export const EXTERNAL_LINKS = {
  fastFreddy: "https://www.fastfreddyexperience.com",
  everydayConnect: "https://everydayconnect.lovable.app",
  improveDetroit: "https://detroitmi.gov/how-do-i/report-problem",
};
