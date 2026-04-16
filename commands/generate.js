import { Command } from "commander";
import axios from "axios";
import { readData, writeData } from '../utils/storage.js';

const generateCommand = new Command("generate")
  .argument("<prompt>")
  .option('--save', 'Save generated request')
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

    } catch (error) {
      console.error("AI Error:", error.response?.data || error.message);
    }
  });

export default generateCommand;