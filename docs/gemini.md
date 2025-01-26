```markdown
# Using Gemini 1.5 Flash with System Instructions in Next.js

This document outlines how to integrate Google's Gemini 1.5 Flash model with system instructions within a Next.js application. System instructions allow you to guide the model's behavior, setting context and ensuring consistent responses.

## Understanding System Instructions

*   **Purpose:** System instructions provide context and guidelines to the Gemini model, shaping its responses throughout a user interaction. This is separate from user-provided prompts.
*   **Functionality:** You can use system instructions to define the model's role (e.g., a helpful assistant, a translator), give contextual information, and set product-level behavior rules.
*   **Model Compatibility:** System instructions are a feature specifically designed for Gemini 1.5 models, including Gemini 1.5 Flash.

## Implementation in Next.js

Here's how to implement Gemini 1.5 Flash with system instructions in your Next.js app:

### 1. API Interaction

Your Next.js application needs to communicate with the Gemini API using Google's Vertex AI platform.

### 2. System Instruction Setup

You will include system instructions as a parameter within your API request to the Gemini model. There are multiple methods to achieve this:

   *   **Python SDK**
      When using the Python SDK the `system_instruction` parameter is available when creating the model and when creating requests.
        ```python
        # Defining the system instructions when creating the model:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro-002",
            system_instruction="You are a helpful assistant."
        )

        # Defining the system instructions when creating the request:
        generate_content_request = {
            "model": f"projects/{project}/locations/{location}/publishers/google/models/{model_name}",
            "contents": [{"role": "USER", "parts": [{"text": prompt}]}],
            "system_instruction": {
              "parts": [
                  {"text": "You are a helpful assistant."},
                  {"text": "Your mission is to translate text in English to French."},
              ]
           }
        }
        ```
   *   **REST API (cURL)**
      Include system instructions within the JSON payload, using a `systemInstruction` field.
        ```json
         {
            "contents": [
                {
                    "parts": [
                        {
                            "text": "User input: I like bagels. Answer:"
                        }
                    ],
                    "role": "USER"
                }
            ],
            "systemInstruction": {
                 "parts": [
                     {"text": "You are a helpful assistant."},
                     {"text":"Your mission is to translate text in English to French."}
                ]
            },
            "model": "projects/your-project-id/locations/us-central1/publishers/google/models/gemini-1.5-flash-001"
        }
        ```
   *   **Node.js**
        Use the `systemInstructions` parameter when making a request.
          ```javascript
          const { TextServiceClient } = require("@google-ai/generativelanguage");
          const { GoogleAuth } = require("google-auth-library");

          const MODEL_NAME = "gemini-1.5-pro-001";
          async function main() {
            const client = new TextServiceClient({
                authClient: new GoogleAuth().fromAPIKey(process.env.API_KEY),
            });

            const systemInstructions = {
              parts: [
                { text: "You are a cat. Your name is Neko." },
              ]
            }

            const request = {
              model: MODEL_NAME,
              systemInstructions,
              prompt: {
                  text: "Hello",
              },
            };
            const result = await client.generateText(request);
            console.log(result);
          }
          ```

### 3. Next.js API Route

Create an API route within your Next.js application to handle the interaction with the Gemini API. This is where you'll include your API key and implement the request logic.

### 4. Frontend Integration

From your Next.js frontend components, you'll send requests to your API route, passing the user's prompts and receiving the responses.

## Code Examples

**Note:**  These examples provide guidance, and you'll need to adapt them to your specific needs.

### Example API Route (Conceptual)
```javascript
// pages/api/gemini.js
import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

const MODEL_NAME = "gemini-1.5-flash-001";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { prompt, systemInstructions } = req.body;

  try {
    const client = new TextServiceClient({
          authClient: new GoogleAuth().fromAPIKey(process.env.API_KEY),
    });
    const request = {
      model: MODEL_NAME,
      systemInstructions: {
        parts: [
          { text: systemInstructions}
        ]
      },
      prompt: {
        text: prompt
      },
    };
    const result = await client.generateText(request);

      res.status(200).json({ response: result });
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      res.status(500).json({ error: "Failed to get response" });
    }
}

```

### Example Frontend Component

```jsx
// components/ChatComponent.jsx
import { useState } from 'react';

export default function ChatComponent() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const systemInstructions = "You are a helpful assistant."; // Define your system instructions here.
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, systemInstructions }),
      });
      const data = await res.json();
        if(data.response){
            setResponse(data.response.candidates[0].output.text);
        }
    } catch (error) {
      console.error('Failed to call API', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div>{response}</div>
    </div>
  );
}

```
## Key Considerations

*   **Authentication:** Obtain a Google Cloud API key and store it securely using environment variables (e.g., `.env.local` in Next.js).
*   **Error Handling:** Implement proper error handling to catch API errors and display appropriate messages to the user.
*   **Model Selection:** Ensure you specify `gemini-1.5-flash-001` (or similar) when making your requests.
*   **Library Usage:** Use the official Google AI client libraries for easier integration (e.g. `@google-ai/generativelanguage`).
*   **Rate Limiting & Quotas:** Be aware of rate limits and quotas for the Gemini API.
*   **SDK Bug:** Note a potential bug with the `gemini-1.5-flash` model in the Generative AI SDK that might ignore `systemInstruction`. REST API calls might serve as a workaround if needed.

## Additional Resources

*   **Official Gemini Documentation:**  Refer to Google's official Gemini API documentation for the most up-to-date information.
*   **Google Cookbooks:** Check out Google's Gemini cookbook for examples on system instructions:
    * [System Instructions](https://github.com/google-gemini/cookbook/blob/main/quickstarts/System_instructions.ipynb)
    * [REST API Example](https://github.com/google-gemini/cookbook/blob/main/quickstarts/rest/Prompting_REST.ipynb)
*   **GitHub Examples:** Explore repositories for inspiration:
    *   [BitnPi/gemini-20-next-app](https://github.com/BitnPi/gemini-20-next-app)
    *   [Xeven777/gemini-chat](https://github.com/Xeven777/gemini-chat)
   *    [u14app/gemini-next-chat](https://github.com/u14app/gemini-next-chat)
*   **YouTube Tutorials:** Search for videos demonstrating Gemini Pro integration in Next.js, as similar approaches apply. (e.g. [this video](https://www.youtube.com/watch?v=06tB-0H2m-o))

This documentation provides a starting point. Remember to experiment, test thoroughly, and adapt these guidelines for your specific project requirements.
```