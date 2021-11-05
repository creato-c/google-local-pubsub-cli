import path from 'path';
import { Argv } from 'mri';
import { createPubSub } from '../pubsub';
import { TopicMetadata } from '@google-cloud/pubsub';

const ALREADY_EXISTS = 6;

export async function topics(argv: Argv) {
  process.stdout.write(`
topics execution
\n`);

  if (argv.help || argv.h) {
    process.stdout.write(`
Usage:
    glpubsub topics <COMMAND>
\n`);
    process.exit(0);
  }

  const client = createPubSub(argv.project ?? argv.p);
  console.log(client);

  if (argv.config || argv.c) {
    process.stdout.write(`
create topic from configure file(json)
\n`);

    const loadPath = path.join(process.cwd(), argv.config ?? argv.c);
    const metas = require(loadPath) as TopicMetadata[];
    console.log(metas);

    const errors: any[] = [];
    const results = await Promise.all(
      metas.map(async (meta) => {
        try {
          const res = await client.createTopic(meta);
          console.info(`Topic "${meta.name}" created.`);
          return res;
        } catch (err: any) {
          if (err.code === ALREADY_EXISTS) {
            console.info(`Topic "${meta.name}" already exists.`);
            errors.push(`Topic "${meta.name}" already exists.`);
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
