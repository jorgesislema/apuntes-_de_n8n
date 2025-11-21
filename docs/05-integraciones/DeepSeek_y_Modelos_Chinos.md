# Integración con IAs Chinas (DeepSeek, Qwen, Yi)

El ecosistema de IA en China está explotando con modelos que rivalizan con GPT-4 a una fracción del costo. La mayoría de estos modelos han adoptado el estándar de **OpenAI API Compatible**, lo que facilita enormemente su integración en n8n.

## 🇨🇳 DeepSeek (DeepSeek-V3 / R1)

DeepSeek ha ganado fama por su rendimiento en código y razonamiento (modelo R1) a precios extremadamente bajos.

### Cómo conectar en n8n
No necesitas un nodo especial. Usa el nodo **OpenAI Chat Model**.

1. **Credencial:** Crea una nueva credencial de tipo `OpenAI API`.
   - **API Key:** Tu llave de `platform.deepseek.com`.
   - **Base URL:** `https://api.deepseek.com` (¡Importante!).
2. **Nodo:** `AI Agent` o `Basic LLM Chain`.
   - Conecta el modelo `OpenAI Chat Model`.
   - En el campo **Model Name**, selecciona "Expression" y escribe manualmente: `deepseek-chat` o `deepseek-reasoner`.

### Modelos Disponibles
- `deepseek-chat` (V3): Uso general, rápido, barato.
- `deepseek-reasoner` (R1): Modelo de razonamiento (Chain of Thought), ideal para lógica compleja, matemáticas y código.

---

## 🐼 Alibaba Qwen (Tongyi Qianwen)

Qwen es uno de los modelos open-source más potentes. Disponible vía Alibaba Cloud (DashScope).

### Conexión (OpenAI Compatible)
Alibaba ofrece un endpoint compatible.
- **Base URL:** `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`
- **API Key:** Obtener en Alibaba Cloud Console.
- **Model Name:** `qwen-plus`, `qwen-turbo`, `qwen-max`.

---

## 01.AI (Yi)

Modelos con ventanas de contexto gigantes (200k tokens).

- **Base URL:** `https://api.01.ai/v1`
- **Model Name:** `yi-large`, `yi-medium`.

---

## 🛠️ Uso con HTTP Request (Método Universal)

Si el nodo de OpenAI falla o necesitas parámetros específicos no soportados, usa el nodo `HTTP Request`.

**Configuración Típica:**
- **Method:** POST
- **URL:** `https://api.deepseek.com/chat/completions`
- **Authentication:** Header Auth (`Authorization: Bearer sk-tu-clave`).
- **Body (JSON):**
```json
{
  "model": "deepseek-chat",
  "messages": [
    {"role": "system", "content": "Eres un asistente útil."},
    {"role": "user", "content": "Hola, ¿quién eres?"}
  ],
  "temperature": 0.7
}
```

## ⚠️ Consideraciones de Privacidad y Latencia
- **Latencia:** Al estar los servidores en China o regiones asiáticas, la latencia puede ser mayor que con OpenAI (EE.UU.).
- **Privacidad:** Revisa los términos de servicio si manejas datos sensibles (GDPR). Para uso empresarial estricto, considera usar estos modelos vía proveedores como **OpenRouter** o **Groq** (si los alojan), o self-hosted con **Ollama**.

### DeepSeek Local con Ollama
Si quieres privacidad total:
1. Instala Ollama en tu servidor.
2. Ejecuta `ollama run deepseek-r1`.
3. En n8n, usa el nodo **Ollama Chat Model**.
   - Base URL: `http://tu-servidor:11434`.
   - Model: `deepseek-r1`.
