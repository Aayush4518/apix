//making help menu of apix
import { Command } from "commander";

const helpCommand= new Command('help')
    .description("Display help information about Apix CLI tool")
    .action(()=>{
        console.log(`
Apix CLI Tool - A API testing tool with AI capabilities
=======================================================

Usage: apix [command] [options]

Commands:
  run     Run API tests based on provided configurations
  help    Display help information about Apix CLI tool

Options:
  -h, --help     Display help information
  -V, --version  Display the version number
`)
    })

export default helpCommand;