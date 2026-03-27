import axios from "axios";
// import { program } from "commander";
import { Command } from "commander";
import { readData } from "../utils/storage.js";

const runCommand = new Command('run')
    .description("Run API tests based on provided configurations")
    .argument('[method]', 'HTTP method (GET, POST, PUT, DELETE)')
    .argument('[url]', 'API endpoint URL')
    .usage('<method> <url> [options]')
    .option('-H, --header <header...>', 'Add custom header, e.g. -H "Content-Type: application/json"')
    .option('-d, --data <data...>', 'Add request body (JSON or key=value pairs)')
    .action(async (method, url, options) => {
        try {
        if (!url) {
            const id = method;
            const storedData = readData();

            const req = storedData.find(r => r.id == id);

            if (!req) {
                console.error(`No saved request found with id ${id}`);
                return;
            }

            method = req.method;
            url = req.url;
        }
    }
        catch{
            console.error(`Invalid request id provided: ${method}`)
            return
        }
        try {
            let header = {} // Initialize header object
            if (options.header) //checks if header are provided
            {
                options.header.forEach(h => {
                    const [key, ...value] = h.split(':')
                    header[key.trim()] = value.join(':').trim() //header[content-type]= application/json
                });
            }

            //parse body
            let data = undefined
            if (options.data) {
                // Join array into one string (handles multiple -d args)
                const raw = Array.isArray(options.data) ? options.data.join(' ') : options.data
                const looksLikeJSON = raw.trim().startsWith('{') || raw.trim().startsWith('[')

                if (looksLikeJSON) {
                    // Try parsing raw JSON
                    try {
                        data = JSON.parse(raw)
                    } catch {
                        try {
                            // Fix escaped quotes
                            const fixedRaw = raw.replace(/\\"/g, '"').replace(/\\'/g, "'")
                            data = JSON.parse(fixedRaw)
                        } catch {
                            data = raw // fallback
                        }
                    }
                } else {
                    // Key=value parsing for shell-safe input
                    const obj = {}
                    const pairs = raw.match(/(?:[^\s"]+|"[^"]*")+/g) // respects quoted values
                    if (pairs) {
                        pairs.forEach(item => {
                            const [key, ...rest] = item.split('=')
                            let value = rest.join('=').trim()

                            // Remove surrounding quotes if present
                            if ((value.startsWith('"') && value.endsWith('"')) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.slice(1, -1)
                            }

                            // Convert numbers automatically
                            obj[key] = isNaN(value) ? value : Number(value)
                        })
                    }
                    data = obj //assign the parsed object to data
                }
            }

            const response = await axios({
                method: method.toLowerCase(), url, headers: header, data //because axios expects headers and not header
            })
            console.log(`Status: ${response.status}`);
            console.log('Response data:', JSON.stringify(response.data, null, 2));
        }

        catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
                console.error('Response data:', JSON.stringify(error.response.data, null, 2));
            }
            else {
                console.error('Error:', error.message);
            }
        }

    })

export default runCommand