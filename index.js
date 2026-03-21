#!/usr/bin/env node

import {Command} from 'commander'
import runCommand from './commands/run.js'
import helpCommand from './commands/help.js'

const program= new Command()

program
    .name('Apix')
    .description('A API testing tool with AI capabilities.')
    .version('1.0.0')
    
program.addCommand(helpCommand)

    
program.addCommand(runCommand)

program.parse()
//abc