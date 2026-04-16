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
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: `Convert this into an API request JSON.

Prompt: "${prompt}"

Return ONLY JSON:
Rules:
- Use FULL correct URL
- For GET requests, put query parameters in the URL, NOT in body
- Body should be empty for GET
{
  "method": "",
  "url": "",
  "headers": {},
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

      text = text.replace(/```json|```/g, "").trim();
      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {
        console.error("AI returned invalid JSON");
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