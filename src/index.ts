#!/usr/bin/env node

import mri, { Argv } from 'mri';
const pkg = require('../package.json');
import { topics } from './lib/topics';
import { subscriptions } from './lib/subscriptions';

const argv = mri(process.argv.slice(2), {
  boolean: ['help', 'h', 'version', 'v'],
});

async function main(argv: Argv) {
  switch (argv._[0]) {
    case 'topics':
      return topics(argv).then((_) => {
        process.exit(0);
      });
    case 'subscriptions':
      subscriptions(argv);
      process.exit(0);
    default:
      break;
  }

  if (argv.help || argv.h) {
    process.stdout.write(`
  Usage:
      glpubsub <GROUP>
  \n`);
    process.exit(0);
  }

  if (argv.version || argv.v) {
    process.stdout.write(`${pkg.name} v${pkg.version}\n`);
    process.exit(0);
  }

  process.exit(0);
}

main(argv);
