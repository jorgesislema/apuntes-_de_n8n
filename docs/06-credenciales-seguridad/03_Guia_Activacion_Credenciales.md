# Guía de Activación de Credenciales por Categoría

Esta guía explica cómo obtener y activar las credenciales para las integraciones más comunes del catálogo, agrupadas por su método de autenticación.

## 🔐 Tipos de Autenticación Comunes

1.  **OAuth2 (El más común y seguro):**
    *   **Qué es:** Un protocolo donde autorizas a n8n a acceder a tu cuenta sin compartir tu contraseña.
    *   **Cómo funciona:** Creas una "App" en el servicio (ej. Google Cloud, Slack Developer), obtienes un `Client ID` y `Client Secret`, y los pegas en n8n.
    *   **Ventaja:** Puedes revocar el acceso cuando quieras.

2.  **API Key (Clave de API):**
    *   **Qué es:** Un código secreto largo que actúa como contraseña para programas.
    *   **Cómo funciona:** Vas a la configuración de tu cuenta -> "Developers" o "Integrations" -> "Generate API Key".
    *   **Cuidado:** Si alguien ve tu API Key, tiene acceso total. No la compartas.

---

## 🧠 AI & Machine Learning

| Servicio | Tipo | Dónde conseguirla |
| :--- | :--- | :--- |
| **OpenAI** | API Key | [OpenAI Platform](https://platform.openai.com/api-keys) -> Create new secret key. |
| **Hugging Face** | Access Token | Settings -> Access Tokens -> New Token (Role: Read/Write). |
| **Pinecone** | API Key | Console -> API Keys. |

## 📊 Analytics & Data

| Servicio | Tipo | Dónde conseguirla |
| :--- | :--- | :--- |
| **Google Analytics 4** | OAuth2 | Requiere proyecto en GCP. Ver [Guía Maestra Google](../05-integraciones/Google/00_Guia_Maestra_Credenciales.md). |
| **PostHog** | API Key | Project Settings -> Project API Key. |
| **Mixpanel** | Service Account | Project Settings -> Service Accounts. |

## 💬 Communication & Chat

| Servicio | Tipo | Dónde conseguirla |
| :--- | :--- | :--- |
| **Slack** | OAuth2 | [Slack API](https://api.slack.com/apps) -> Create New App -> OAuth & Permissions. |
| **Telegram** | Access Token | Habla con [@BotFather](https://t.me/botfather) en Telegram -> `/newbot`. |
| **Discord** | Bot Token | [Discord Developer Portal](https://discord.com/developers/applications) -> Bot -> Reset Token. |
| **SendGrid** | API Key | Settings -> API Keys -> Create API Key (Full Access). |

## 🤝 CRM & Sales

| Servicio | Tipo | Dónde conseguirla |
| :--- | :--- | :--- |
| **HubSpot** | OAuth2 / Private App | Settings -> Integrations -> Private Apps -> Create new app -> Get Access Token. |
| **Salesforce** | OAuth2 | Setup -> App Manager -> New Connected App. (Complejo, requiere Consumer Key/Secret). |
| **Pipedrive** | API Token | Settings -> Personal Preferences -> API. |

## 🗄️ Data & Databases

| Servicio | Tipo | Dónde conseguirla |
| :--- | :--- | :--- |
| **Airtable** | Personal Access Token | [Airtable Builder Hub](https://airtable.com/create/tokens) -> Create new token. |
| **Notion** | Internal Integration Token | [Notion My Integrations](https://www.notion.so/my-integrations) -> New integration. |
| **Supabase** | Service Role Secret | Project Settings -> API -> Project API keys. |
| **PostgreSQL** | User/Password | Tu proveedor de hosting (AWS RDS, DigitalOcean, etc.). |

## ☁️ Storage & Files

| Servicio | Tipo | Dónde conseguirla |
| :--- | :--- | :--- |
| **Google Drive** | OAuth2 | Ver [Guía Maestra Google](../05-integraciones/Google/00_Guia_Maestra_Credenciales.md). |
| **AWS S3** | Access Key ID + Secret | IAM Console -> Users -> Security credentials -> Create access key. |
| **Dropbox** | OAuth2 | [Dropbox App Console](https://www.dropbox.com/developers/apps) -> Create App. |

## 💰 Finance

| Servicio | Tipo | Dónde conseguirla |
| :--- | :--- | :--- |
| **Stripe** | Secret Key | Dashboard -> Developers -> API keys -> Reveal live key token. |
| **PayPal** | Client ID + Secret | [PayPal Developer](https://developer.paypal.com/dashboard/) -> Apps & Credentials. |

---

### 💡 Consejo de Seguridad
Nunca guardes estas credenciales en archivos de texto plano dentro de tu repositorio Git.
n8n las guarda encriptadas en su base de datos interna. Si necesitas compartirlas, usa un gestor de contraseñas como 1Password o Bitwarden.
