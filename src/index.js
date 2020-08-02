#!/usr/bin/env node

const { program } = require('commander')
const commandes = require('./commandes')

program
  .version('0.0.1', '-v, --vers', 'output the current version')
  .description('Component starter files and folders creator')


program
  .command('add  <component_name>')
  .command('a  <component_name>')
  .description('Add new component starter folder')
  .action(commandes.add)

program.parse(process.argv)
