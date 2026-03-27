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
  save    Save API request configuration for future use
  list    List all saved API request configurations

Options:
  -h, --help     Display help information
  -V, --version  Display the version number
Examples:
  apix run GET https://api.example.com/users -H "Authorization: Bearer token" -d '{"name": "John"}'
  apix save POST https://api.example.com/users
  apix list
`)
    })

export default helpCommand;