import { Command } from "commander";
import axios from "axios";
import { readData, writeData } from '../utils/storage.js';

const normalizeUrl = (requestUrl) => {
  if (!requestUrl || typeof requestUrl !== 'string') return requestUrl;
  if (requestUrl.startsWith('http://') || requestUrl.startsWith('https://')) {
    return requestUrl;
  }
  if (requestUrl.startsWith('//')) {
    return `https:${requestUrl}`;
  }
  if (requestUrl.startsWith('/')) {
    return `http://localhost${requestUrl}`;
  }
  return `http://${requestUrl}`;
};

const generateCommand = new Command("generate")
  .argument("<prompt>")
  .option('--save', 'Save generated request')
  .option('--run', 'Execute generated request immediately')
  .action(async (prompt, options) => {
    if (!process.env.GROQ_API_KEY) {
      console.log("\n❌ Missing GROQ_API_KEY");
      console.log("👉 Set it using:");
      console.log('setx GROQ_API_KEY "your_api_key_here" (Windows)');
      console.log('export GROQ_API_KEY="your_api_key_here" (Mac/Linux)\n');
      return;
    }

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: `You MUST return ONLY a valid JSON object. No markdown, no explanation, no extra text.

User request: "${prompt}"

Generate a single JSON object for this API request. Use jsonplaceholder.typicode.com for testing.

{
  "method": "GET",
  "url": "https://jsonplaceholder.typicode.com/posts",
  "headers": {"Content-Type": "application/json"},
  "body": {}
}`
            }
          ]
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      let text = response.data.choices[0].message.content;

      text = text.replace(/```json\n?|```\n?/g, "").trim();
      
      // Remove any leading/trailing whitespace and common wrapper text
      text = text.replace(/^[\s\n]*/, "").replace(/[\s\n]*$/, "");
      text = text.replace(/^Here is.*?:\s*/i, "").replace(/^Here's.*?:\s*/i, "");
      
      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch (parseError) {
        console.error("AI returned invalid JSON");
        console.error("Raw response:", text.substring(0, 500));
        console.error("Parse error:", parseError.message);
        return;
      }
      console.log("\nGenerated Request:\n");
      console.log(text);
      if (options.save) {
        const data = readData()

        const newRequest = {
          id: data.length + 1,
          method: parsed.method,
          url: parsed.url,
          headers: parsed.headers || {},
          body: parsed.body || {}
        }
        data.push(newRequest);
        writeData(data);
        console.log(`Request saved with ID: ${newRequest.id}`);
      }

      if (options.run) {
        const requestUrl = normalizeUrl(parsed.url);
        if (!requestUrl) {
          console.error('Cannot run request because generated url is missing.');
          return;
        }

        try {
          const response = await axios({
            method: (parsed.method || 'GET').toLowerCase(),
            url: requestUrl,
            headers: parsed.headers || {},
            data: Object.keys(parsed.body || {}).length ? parsed.body : undefined,
          });

          console.log(`\nRequest executed successfully.`);
          console.log(`Status: ${response.status}`);
          console.log('Response data:', JSON.stringify(response.data, null, 2));
        } catch (runError) {
          if (runError.response) {
            console.error(`\nRun Error: ${runError.response.status} - ${runError.response.statusText}`);
            console.error('Response data:', JSON.stringify(runError.response.data, null, 2));
          } else {
            console.error('\nRun Error:', runError.message);
          }
        }
      }

    } catch (error) {
      console.error("AI Error:", error.response?.data || error.message);
    }
  });

export default generateCommand;