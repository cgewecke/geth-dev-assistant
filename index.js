#!/usr/bin/env node

const app = require('./lib/app');

const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .options({
    'accounts': {
      default: 0,
      describe: 'number of accounts to create / unlock',
      type: 'number',
    },
    'password': {
      default: 'left-hand-of-darkness',
      describe: 'for geth accounts',
      type: 'string',
    },
    'balance': {
      default: 100,
      describe: 'account starting balances (in ETH)',
      type: 'number'
    },
    'gasLimit': {
      default: 5900000,
      describe: 'block gas limit target to mine towards',
      type: 'number'
    },
    'launch': {
      default: true,
      describe: 'launch geth docker in the background',
      type: 'boolean',
    },
    'repo': {
      default: 'ethereum/client-go',
      describe: 'docker hub root',
      type: 'string'
    },
    'tag': {
      default: 'stable',
      describe: 'geth docker release to pull & use',
      type: 'string',
    },
    'offline': {
      describe: 'skip docker pull step (image is locally available)',
      type: 'boolean',
    },
    'sleep': {
      default: 10,
      describe: 'seconds to wait for geth to spin up',
      type: 'number'
    },
    'period': {
      default: 0,
      describe: 'automining interval',
      type: 'number'
    },
    'port': {
      default: 8545,
      describe: 'http port to connect to client with',
      type: 'number'
    },
    'wsport': {
      default: 8546,
      describe: 'ws port to connect to client with',
      type: 'number'
    },
  })
  .help()
  .argv

// Run
app(argv);

