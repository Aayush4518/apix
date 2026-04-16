import axios from "axios";
import { Command } from "commander";
import { readData } from "../utils/storage.js";

const isUrl = (value) => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const parseHeaders = (headerArgs) => {
    const headers = {};
    if (!headerArgs) return headers;

    headerArgs.forEach((header) => {
        const [key, ...valueParts] = header.split(":");
        const value = valueParts.join(":").trim();
        if (key) {
            headers[key.trim()] = value;
        }
    });

    return headers;
};

const parseDataArg = (dataArgs) => {
    if (!dataArgs) return undefined;

    const raw = Array.isArray(dataArgs) ? dataArgs.join(" ") : dataArgs;
    const trimmed = raw.trim();

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            return JSON.parse(trimmed);
        } catch {
            const fixed = trimmed.replace(/\\"/g, '"').replace(/\\'/g, "'");
            try {
                return JSON.parse(fixed);
            } catch {
                return raw;
            }
        }
    }

    const obj = {};
    const tokens = raw.match(/(?:[^\s"]+|"[^"]*")+/g);
    if (!tokens) return raw;

    for (let i = 0; i < tokens.length; i++) {
        const item = tokens[i];
        if (!item.includes(":")) continue;

        const [key, ...rest] = item.split(":");
        let value = rest.join(":").trim();

        if (value === "" && i + 1 < tokens.length && !tokens[i + 1].includes("=")) {
            value = tokens[++i];
        }

        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        obj[key] = value === "" ? "" : isNaN(value) ? value : Number(value);
    }

    return obj;
};

const runCommand = new Command('run')
    .description('Run API tests based on provided configurations')
    .argument('[methodOrUrl]', 'HTTP method or URL when method is omitted')
    .argument('[url]', 'API endpoint URL or saved request ID')
    .usage('[method] <url> [options]')
    .option('-H, --header <header...>', 'Add custom header, e.g. -H "Content-Type: application/json"')
    .option('-d, --data <data...>', 'Add request body (JSON or key=value pairs)')
    .action(async (methodOrUrl, url, options) => {
        if (!methodOrUrl) {
            console.error('Usage: apix run [method] <url> [options]');
            return;
        }

        let method = 'GET';
        let requestUrl = methodOrUrl;

        if (!url) {
            if (!isUrl(methodOrUrl)) {
                const storedData = readData();
                const req = storedData.find((r) => String(r.id) === String(methodOrUrl));
                if (!req) {
                    console.error(`No saved request found with id ${methodOrUrl}`);
                    return;
                }
                method = req.method || 'GET';
                requestUrl = req.url;
                options.header = options.header
                    ? options.header.concat(Object.entries(req.header || {}).map(([k, v]) => `${k}:${v}`))
                    : Object.entries(req.header || {}).map(([k, v]) => `${k}:${v}`);
                if (req.body && !options.data) {
                    options.data = [JSON.stringify(req.body)];
                }
            }
        } else {
            method = methodOrUrl;
            requestUrl = url;
        }

        const headers = parseHeaders(options.header);
        const data = parseDataArg(options.data);
        let finalData = data;
        if (typeof data === 'string') {
            try {
                finalData = JSON.parse(data);
            } catch {
                finalData = data;
            }
        }
        try {
            if (!requestUrl.startsWith("http")) {
                requestUrl = "https://jsonplaceholder.typicode.com" + requestUrl;
            }
            const response = await axios({
                method: method.toLowerCase(),
                url: requestUrl,
                headers,
                data: finalData,
            });

            console.log(`Status: ${response.status}`);
            console.log('Response data:', JSON.stringify(response.data, null, 2));
        } catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
                console.error('Response data:', JSON.stringify(error.response.data, null, 2));
            } else {
                console.error('Error:', error.message);
            }
        }
    });

export default runCommand