import path from 'path';
import { Argv } from 'mri';
import { createPubSub } from '../pubsub';
import { CreateSubscriptionOptions } from '@google-cloud/pubsub';

// type CreateSubscriptionOptions = {
//   gaxOpts?: CallOptions;
//   flowControl?: FlowControlOptions;

//   messageRetentionDuration?: google.protobuf.IDuration | number;
//   pushEndpoint?: string;
//   oidcToken?: OidcToken;

//   /** Subscription name */
//   name?: (string|null);
//   /** Subscription topic */
//   topic?: (string|null);
//   /** Subscription pushConfig */
//   pushConfig?: (google.pubsub.v1.IPushConfig|null);
//   /** Subscription ackDeadlineSeconds */
//   ackDeadlineSeconds?: (number|null);
//   /** Subscription retainAckedMessages */
//   retainAckedMessages?: (boolean|null);
//   /** Subscription labels */
//   labels?: ({ [k: string]: string }|null);
//   /** Subscription enableMessageOrdering */
//   enableMessageOrdering?: (boolean|null);
//   /** Subscription expirationPolicy */
//   expirationPolicy?: (google.pubsub.v1.IExpirationPolicy|null);
//   /** Subscription filter */
//   filter?: (string|null);
//   /** Subscription deadLetterPolicy */
//   deadLetterPolicy?: (google.pubsub.v1.IDeadLetterPolicy|null);
//   /** Subscription retryPolicy */
//   retryPolicy?: (google.pubsub.v1.IRetryPolicy|null);
//   /** Subscription detached */
//   detached?: (boolean|null);
//   /** Subscription topicMessageRetentionDuration */
//   topicMessageRetentionDuration?: (google.protobuf.IDuration|null);
// }

const ALREADY_EXISTS = 6;

export async function subscriptions(argv: Argv) {
  process.stdout.write(`
subscriptions execution
\n`);

  if (argv.help || argv.h) {
    process.stdout.write(`
Usage:
  glpubsub topics <COMMAND>
\n`);
    process.exit(0);
  }

  const client = createPubSub(argv.project ?? argv.p);

  if (argv.config || argv.c) {
    process.stdout.write(`
create topic from configure file(json)
\n`);

    const loadPath = path.join(process.cwd(), argv.config ?? argv.c);
    const metas = require(loadPath) as (CreateSubscriptionOptions & {
      topic: string;
      name: string;
    })[];
    console.log(metas);

    const errors: any[] = [];
    const results = await Promise.all(
      metas.map(async (meta) => {
        try {
          const res = await client.createSubscription(
            meta.topic,
            meta.name,
            meta
          );
          console.info(`Subscription "${meta.name}" created.`);
          return res;
        } catch (err: any) {
          if (err.code === ALREADY_EXISTS) {
            console.info(`Subscription "${meta.name}" already exists.`);
            errors.push(`Subscription "${meta.name}" already exists.`);
          } else {
            console.log(err);
          }
        }
      })
    );

    if (errors.length > 0) {
      console.log('has errors', errors);
      process.exit(1);
    }

    console.log('results', results);
    process.exit(0);
  }

  process.exit(0);
}
