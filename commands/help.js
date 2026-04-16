import { Command } from "commander";

const helpCommand = new Command("help")
  .description("Show help for Apix CLI")
  .action(() => {
    console.log(`
🚀 Apix CLI — API Testing Tool with AI
=====================================

Usage:
  apix <command> [options]

------------------------------------------------
📦 Core Commands
------------------------------------------------
  run <method> <url>      Run API request
  run <id>                Run saved request

  save <method> <url>     Save API request
  list                    List saved requests
  edit <id>               Edit saved request
  delete <id>             Delete request

------------------------------------------------
🤖 AI Commands
------------------------------------------------
  generate "<prompt>"          Generate API request
  generate --save              Save generated request
  generate --run               Run generated request
  generate --save --run        Save + run instantly

------------------------------------------------
⚙️ Options
------------------------------------------------
  -H, --header <key:value>     Add headers
  -d, --data <data>            Add request body (JSON or key=value)

------------------------------------------------
📘 Examples
------------------------------------------------

1️⃣ Simple GET request
  apix run GET https://dummyjson.com/users

2️⃣ POST request with JSON body (PowerShell safe)
  apix run POST https://jsonplaceholder.typicode.com/users -H "Content-Type:application/json" -d '{ "firstName": "Trojan", "lastName": "Horse" }'
                                                            OR
  apix run POST https://jsonplaceholder.typicode.com/users -H "Content-Type:application/json" -d FirstName: "TJ" lastName: "Horse" 

3️⃣ POST using key=value format
  apix run POST https://dummyjson.com/users/add -d name="Trojan" role="Developer"

4️⃣ Save and reuse request
  apix save GET https://dummyjson.com/users
  apix list
  apix run 1

5️⃣ AI generate + run instantly
  apix generate "create login api" --run

6️⃣ AI generate + save
  apix generate "create user api" --save

------------------------------------------------
💡 Tips
------------------------------------------------
• Use JSON format for complex data
• For PowerShell, wrap JSON in single quotes
• AI-generated URLs may need adjustment

------------------------------------------------
`);
  });

export default helpCommand;