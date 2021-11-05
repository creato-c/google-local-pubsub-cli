import { Argv } from 'mri';
import { createPubSub } from '../pubsub';

export function subscriptions(argv: Argv) {
  process.stdout.write(`
subscriptions execution
\n`);

  const client = createPubSub(argv.project ?? argv.p);
  console.log(client);
}
