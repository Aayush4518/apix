import { Command } from "commander";
import { readData, writeData } from "../utils/storage.js";

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
            return raw;
        }
    }

    const obj = {};
    const tokens = raw.match(/(?:[^\s"]+|"[^"]*")+/g);
    if (!tokens) return raw;

    for (let i = 0; i < tokens.length; i++) {
        const item = tokens[i];
        if (!item.includes("=")) continue;

        const [key, ...rest] = item.split("=");
        let value = rest.join("=").trim();

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

const saveCommand = new Command('save')
    .description("Save API request configuration for future use")
    .argument('<method>')
    .argument('<url>')
    .option('-H, --header <header...>', 'Add custom header, e.g. -H "Content-Type: application/json"')
    .option('-d, --data <data...>', 'Add request body (JSON or key=value pairs)')
    .action((method, url, options) => {
        const data = readData();
        const parsedHeader = parseHeaders(options.header);
        const parsedBody = parseDataArg(options.data);

        const newRequest = {
            id: data.length + 1,
            method: method.toUpperCase(),
            url,
            header: parsedHeader,
            body: parsedBody,
        };

        data.push(newRequest);
        writeData(data);

        console.log(`Saved request: ${newRequest.method} ${url} with id ${newRequest.id}`);
    });

export default saveCommand