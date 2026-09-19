/**
 * Compatibility surface for the measurement layer.
 * The implementation lives in `@/lib/analytics`.
 */
import type { CategoryId } from "@/data/resources";
import { track } from "@/lib/analytics";

export {
  anonymousSessionId,
  persistCheckIn,
  fetchImpactTotals,
  fetchCategoryDemand,
  fetchFunnel,
  track,
  trackResourceView,
  queryTopic,
  distanceBucket,
  type ImpactTotals,
  type CategoryDemand,
  type FunnelStage,
} from "@/lib/analytics";

export type EngagementType = "resource_view" | "get_there" | "category_selected";

/** Legacy helper kept so existing call sites keep working. */
export async function logEngagement(input: {
  type: EngagementType;
  resourceSlug: string;
  category: CategoryId | string;
  neighborhood?: string | undefined;
}): Promise<void> {
  await track(input.type, {
    resourceSlug: input.resourceSlug,
    category: input.category,
    neighborhood: input.neighborhood,
  });
}
