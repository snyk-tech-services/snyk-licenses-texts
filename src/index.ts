#!/usr/bin/env node
import * as yargs from 'yargs';

yargs
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv
