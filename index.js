#!/usr/bin/env node

import {Command} from 'commander'
import runCommand from './commands/run.js'
import helpCommand from './commands/help.js'
import saveCommand from './commands/save.js'
import deleteCommand from './commands/delete.js'
import editCommand from './commands/edit.js'

const program= new Command()

program
    .name('Apix')
    .description('A API testing tool with AI capabilities.')
    .version('1.0.0')
    
program.addCommand(helpCommand)
program.addCommand(runCommand)
program.addCommand(saveCommand)
program.addCommand(deleteCommand)
program.addCommand(editCommand)
program.addCommand((await import('./commands/list.js')).default) //dynamic import for list command

program.parse()
