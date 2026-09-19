import { createFileRoute } from "@tanstack/react-router";
import { FoodSupport } from "@/components/kih/FoodSupport";

const TITLE = "Community + Public Health — Food support, connected around you | Know I'm Here";
const DESC = "Know I'm Here helps Detroit residents discover food pantries, nutrition programs, grocery assistance and community health resources based on need, location and timing.";

export const Route = createFileRoute("/community-health")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
  component: CommunityHealth,
});

function CommunityHealth() {
  return <FoodSupport />;
}
