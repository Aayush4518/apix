# 🚀 Apix — AI-Powered CLI for API Testing

Apix is a lightweight CLI tool that lets you **run, save, and generate API requests directly from your terminal** — with built-in AI support.

> ⚡ Skip Postman. Stay in your terminal. Move faster.

---

## ✨ Features

* ⚡ Run API requests (GET, POST, PUT, DELETE)
* 💾 Save & reuse API configurations
* 🤖 Generate APIs using natural language (AI-powered)
* 🔥 Instant execution (`--run`)
* 📦 Persistent request storage
* 🧠 Supports JSON and key=value body formats
* 🧩 Simple, developer-friendly CLI

---

## 📦 Installation

```bash id="b4m3k2"
npm install -g apix
```

---



## 🚀 Quick Start

### 🔹 Run a simple GET request

```bash id="z4p9r8"
apix run GET https://dummyjson.com/users
```

---

### 🔹 Run a POST request (JSON)

```bash id="p7c8n1"
apix run POST https://dummyjson.com/users/add -H "Content-Type:application/json" -d '{ "firstName": "Aayush", "lastName": "Singh" }'
```
Run apix help for more INFO

---

### 🔹 Run using key=value format

```bash id="k9s2v6"
apix run POST https://dummyjson.com/users/add -d name="Aayush" role="Developer"
```

---

## 💾 Save & Reuse Requests

```bash id="w2d1q7"
apix save GET https://dummyjson.com/users
apix list
apix run 1
```

---

## 🤖 AI Features (Core Highlight)

### 🔹 Generate API from natural language

```bash id="m8x5a3"
apix generate "create login api"
```

---

### 🔹 Generate and run instantly

```bash id="t3y7l2"
apix generate "create login api" --run
```

---

### 🔹 Generate, save and run

```bash id="q1v6c9"
apix generate "create user api" --save --run
```

---

### Screenshots: 

1)APIX Generate in action
 <img width="1560" height="672" alt="WhatsApp Image 2026-04-19 at 20 08 44 (2)" src="https://github.com/user-attachments/assets/d295b927-977f-4dd6-9ede-53ca5713897c" />

 
2) Apix Run command
<img width="1503" height="704" alt="WhatsApp Image 2026-04-19 at 20 08 44 (1)" src="https://github.com/user-attachments/assets/f7d76732-8f62-40b8-b7ef-24645c592d0a" />


3) More examples
<img width="1280" height="181" alt="WhatsApp Image 2026-04-19 at 20 08 44" src="https://github.com/user-attachments/assets/0f7e6e26-8f03-429d-92f4-73e776b979dc" />


## 📘 Examples

### 🌤 Weather API (query params)

```bash id="e2m4h8"
apix run GET "https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true"
```

---

### 🛒 Fake Store API

```bash id="f6p9k3"
apix run GET https://fakestoreapi.com/products
```

---

### 🧪 Save and execute later

```bash id="n4r2d5"
apix save POST https://dummyjson.com/users/add -d name="Aayush"
apix run 2
```

---

## ⚙️ Commands

| Command               | Description         |
| --------------------- | ------------------- |
| `run <method> <url>`  | Run API request     |
| `run <id>`            | Run saved request   |
| `save <method> <url>` | Save request        |
| `list`                | List saved requests |
| `edit <id>`           | Edit request        |
| `delete <id>`         | Delete request      |
| `generate "<prompt>"` | AI generate request |

---

## 🔑 AI Setup (Required for AI Features)

Apix uses Groq API for AI-powered features.

### 1️⃣ Get API Key

👉 https://console.groq.com/keys

---

### 2️⃣ Set Environment Variable

#### 🪟 Windows (PowerShell)

```bash id="a9k3d1"
setx GROQ_API_KEY "your_api_key_here"
```

---

#### 🍎 Mac/Linux

```bash id="p6m8v2"
export GROQ_API_KEY="your_api_key_here"
```

---

### 3️⃣ Restart your terminal

---

## ⚠️ Notes

* For PowerShell, wrap JSON in **single quotes**

```bash id="s2n4k7"
-d '{ "key": "value" }'
```

* AI-generated URLs may sometimes be placeholders — update if needed

* Without API key:

  * ✅ Run / Save features work
  * ❌ AI features will not work

---

## 🛣 Roadmap/Future Development Plan

* 🔗 API chaining
* 🌍 Environment variables (BASE_URL)
* 📜 Version history (Git-style)
* 🤖 Improved AI suggestions

---


## 📄 License

MIT License

---

## 👨‍💻 Author

Built by Aayush Singh

---

## ⭐ Support

If you found this useful, consider giving it a star ⭐ on GitHub!
