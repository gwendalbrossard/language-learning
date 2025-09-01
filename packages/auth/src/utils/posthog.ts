import type { EventMessage } from "posthog-node"
import { PostHog } from "posthog-node"

import { posthogConfig } from "@acme/shared/posthog"

export const posthogNode = new PostHog(posthogConfig.token, { host: posthogConfig.host })

export const posthogNodeCapture = async ({ distinctId, event, properties, groups, sendFeatureFlags }: EventMessage) => {
  posthogNode.capture({ distinctId, event, properties, groups, sendFeatureFlags })
  await posthogNode.shutdown()
}
