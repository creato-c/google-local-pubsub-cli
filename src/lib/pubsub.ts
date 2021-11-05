'use strict';

import { PubSub } from '@google-cloud/pubsub';

export function createPubSub(projectId = null) {
  return new PubSub({
    projectId: projectId ?? process.env.GOOGLE_CLOUD_PROJECT,
  });
}
