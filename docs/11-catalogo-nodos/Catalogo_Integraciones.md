# Catálogo Detallado de Integraciones n8n

Este documento analiza las integraciones más populares de n8n, detallando su uso, modelo de precios, ventajas, desventajas y alternativas.

---

## 🧠 1. AI & Machine Learning

| Nodo | Función Principal | Modelo | Pros | Contras | Alternativas (Pago / Gratis) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **OpenAI** | Generación de texto (GPT), imágenes (DALL-E) y audio. | Pago (por token) | Estándar de la industria, modelos más potentes. | Costo variable difícil de predecir. Privacidad. | **Pago:** Anthropic, Gemini.<br>**Gratis/Local:** Ollama, LocalAI. |
| **LangChain** | Orquestación de agentes y cadenas de pensamiento. | Open Source (Lib) | Permite crear flujos complejos y memoria. | Curva de aprendizaje alta. | **Pago:** FlowiseAI (SaaS).<br>**Gratis:** Nodos nativos de n8n (AI Agent). |
| **Hugging Face** | Acceso a miles de modelos Open Source. | Freemium | Variedad inmensa de modelos específicos. | Requiere saber elegir el modelo correcto. | **Pago:** Replicate.<br>**Gratis:** Modelos locales. |

**Otros Nodos:** Stability AI, Midjourney, DeepL, Amazon Rekognition, Pinecone (Vector DB), Weaviate.

---

## 📊 2. Analytics & Data

| Nodo | Función Principal | Modelo | Pros | Contras | Alternativas (Pago / Gratis) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Analytics 4** | Medición de tráfico web y eventos. | Gratuito | Estándar global, integración profunda con Google. | Complejo de configurar (GA4 API). Muestreo de datos. | **Pago:** Mixpanel, Amplitude.<br>**Gratis:** Matomo (Self-hosted), Plausible (Open Source). |
| **PostHog** | Analítica de producto y grabación de sesiones. | Freemium (Open Source) | Todo en uno (analítica + feature flags). Self-hostable. | Requiere recursos si lo alojas tú mismo. | **Pago:** Heap, LogRocket.<br>**Gratis:** OpenReplay. |

**Otros Nodos:** Datadog, Grafana, Metabase, Tableau, Power BI, Segment.

---

## 💬 3. Communication & Chat

| Nodo | Función Principal | Modelo | Pros | Contras | Alternativas (Pago / Gratis) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Slack** | Comunicación de equipos y alertas. | Freemium | Integración muy madura en n8n (Block Kit). | Historial limitado en plan gratis. | **Pago:** MS Teams.<br>**Gratis:** Discord, Mattermost, Rocket.Chat. |
| **Telegram** | Bots de mensajería y notificaciones. | Gratuito | 100% Gratis, API muy rápida y sencilla. | Menos uso corporativo que Slack/Teams. | **Pago:** WhatsApp Business API.<br>**Gratis:** Signal (complejo), Discord. |
| **Gmail** | Envío y lectura de correos. | Gratuito (Personal) | Familiaridad, filtros de búsqueda potentes. | Límites de envío estrictos (anti-spam). OAuth complejo. | **Pago:** SendGrid, Mailgun (Transaccional).<br>**Gratis:** Outlook.com. |

**Otros Nodos:** Discord, Microsoft Teams, WhatsApp Business, Twilio, SendGrid, Mailgun.

---

## 🤝 4. CRM & Sales

| Nodo | Función Principal | Modelo | Pros | Contras | Alternativas (Pago / Gratis) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HubSpot** | CRM completo (Marketing, Ventas, Servicio). | Freemium | Muy fácil de usar, ecosistema gigante. | Se vuelve muy caro rápidamente. | **Pago:** Salesforce, Pipedrive.<br>**Gratis:** Odoo (Community), EspoCRM. |
| **Salesforce** | Gestión empresarial de clientes. | Pago (Caro) | Potencia ilimitada, estándar enterprise. | Curva de aprendizaje y configuración muy alta. | **Pago:** Microsoft Dynamics.<br>**Gratis:** Zoho CRM (Plan free). |
| **Pipedrive** | CRM enfocado en embudos de venta. | Pago | Visual, intuitivo para vendedores. | Automatizaciones nativas limitadas (mejor usar n8n). | **Pago:** Close, Copper.<br>**Gratis:** Trello (como CRM básico). |

**Otros Nodos:** Zoho CRM, ActiveCampaign, Freshsales, Insightly, Bitrix24.

---

## 🗄️ 5. Data & Databases

| Nodo | Función Principal | Modelo | Pros | Contras | Alternativas (Pago / Gratis) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Sheets** | "Base de datos" ligera y hoja de cálculo. | Gratuito | Accesible, visual, fácil de compartir. | No escala (lento con >10k filas). No es relacional. | **Pago:** Airtable, SmartSheet.<br>**Gratis:** Baserow, NocoDB. |
| **PostgreSQL** | Base de datos relacional robusta. | Open Source | Potente, estándar SQL, maneja millones de datos. | Requiere conocimientos de SQL y servidor. | **Pago:** Oracle, SQL Server.<br>**Gratis:** MySQL, MariaDB, SQLite. |
| **Airtable** | Base de datos relacional con UI amigable. | Freemium | Muy fácil de usar, vistas potentes, API genial. | Límites de registros en planes bajos. Caro al escalar. | **Pago:** SmartSuite.<br>**Gratis:** Baserow (Self-hosted), NocoDB. |

**Otros Nodos:** MySQL, MongoDB, Redis, Supabase, Snowflake, BigQuery.

---

## ☁️ 6. Storage & Files

| Nodo | Función Principal | Modelo | Pros | Contras | Alternativas (Pago / Gratis) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Drive** | Almacenamiento y gestión de archivos. | Freemium | Integración nativa con Docs/Sheets. Búsqueda potente. | Permisos de carpetas pueden ser confusos. | **Pago:** Dropbox, Box.<br>**Gratis:** OneDrive, Nextcloud. |
| **AWS S3** | Almacenamiento de objetos escalable. | Pago (por uso) | Estándar de la industria, infinitamente escalable. | Complejo de configurar (IAM, Buckets). UI técnica. | **Pago:** Google Cloud Storage.<br>**Gratis:** MinIO (Self-hosted). |

**Otros Nodos:** Dropbox, OneDrive, SharePoint, FTP/SFTP.

---

## ✅ 7. Productivity

| Nodo | Función Principal | Modelo | Pros | Contras | Alternativas (Pago / Gratis) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Notion** | Gestión de conocimiento y proyectos. | Freemium | Flexible (Docs + DB). API muy mejorada. | La API tiene límites de velocidad (Rate Limits). | **Pago:** Coda.<br>**Gratis:** Obsidian (Local), Anytype. |
| **Trello** | Gestión de tareas Kanban. | Freemium | Visualmente simple, curva de aprendizaje nula. | Se queda corto para proyectos complejos. | **Pago:** Asana, Monday, Jira.<br>**Gratis:** Planner (M365), Vikunja. |

**Otros Nodos:** Asana, Jira, ClickUp, Todoist, Google Calendar.

---

## 💰 8. Finance

| Nodo | Función Principal | Modelo | Pros | Contras | Alternativas (Pago / Gratis) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Stripe** | Procesamiento de pagos y suscripciones. | Pago (% por txn) | La mejor API financiera del mundo. Documentación top. | Retención de fondos en casos de riesgo. | **Pago:** PayPal, Adyen.<br>**Gratis:** Transferencias bancarias (manual). |
| **WooCommerce** | E-commerce sobre WordPress. | Open Source | Control total, sin comisiones mensuales. | Requiere mantenimiento de servidor y plugins. | **Pago:** Shopify, BigCommerce.<br>**Gratis:** PrestaShop. |

**Otros Nodos:** PayPal, QuickBooks, Xero, Invoice Ninja.

---

> **Nota:** Esta lista destaca los nodos más utilizados. Para ver la lista completa de más de 300 integraciones, consulta la documentación oficial de n8n o el panel de nodos.
