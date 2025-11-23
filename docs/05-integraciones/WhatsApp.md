# Integración con WhatsApp Business API

WhatsApp es el canal de comunicación más directo. Existen dos formas principales de integrarlo en n8n: la **API Oficial de Meta (Cloud API)** y proveedores externos (Twilio, Waha, etc.). Aquí nos centraremos en la oficial por ser la más robusta y económica.

## 📱 WhatsApp Cloud API (Meta)

### Requisitos Previos
1. Una cuenta de **Meta for Developers**.
2. Una **App** creada en Meta de tipo "Business".
3. Un número de teléfono que **no** esté registrado en WhatsApp personal/Business App (o debes borrar la cuenta para usarlo en la API).

### Configuración de Credenciales

1. En el Dashboard de tu App en Meta, ve a **WhatsApp > API Setup**.
2. Obtén el **Temporary Access Token** (para pruebas) o configura un **System User** para obtener un token permanente (Recomendado para producción).
3. Copia el **Phone Number ID**.

### Nodo: WhatsApp Business Cloud
n8n tiene un nodo nativo.

- **Operation:** `Send Template` o `Send Message`.
- **Credentials:**
  - `Access Token`: El token de Meta.
  - `Phone Number ID`: El ID numérico de tu cuenta de WhatsApp.
  - `Business Account ID`: El ID de tu negocio.

---

## 📨 Tipos de Mensajes

### 1. Plantillas (Templates) - Para iniciar conversación
Para escribirle a un usuario que no te ha escrito en las últimas 24 horas, **DEBES** usar una plantilla aprobada por Meta.
- Se crean en el **WhatsApp Manager**.
- Tienen categorías: `Marketing`, `Utility`, `Authentication`.
- Tienen costo por conversación iniciada.

**Ejemplo en n8n:**
- Resource: `Message`
- Operation: `Send Template`
- Template Name: `hello_world` (o el nombre de tu plantilla)
- Language Code: `es`

### 2. Mensajes de Sesión (Free Form) - Para responder
Si el usuario te escribe, se abre una "ventana de servicio" de 24 horas.
- Puedes enviar texto libre, imágenes, audio, documentos sin costo adicional (dentro de la ventana).
- **Trigger:** Necesitas configurar un **Webhook** en Meta apuntando a tu n8n (`Webhook` node, método POST) para recibir los mensajes entrantes.

---

## 🔄 Recibiendo Mensajes (Webhook)

Para crear un chatbot:
1. Crea un workflow con un nodo **Webhook** (POST).
2. Copia la URL de producción del Webhook.
3. En Meta Developers > WhatsApp > Configuration > **Webhook**:
   - Pega la URL.
   - Verify Token: Un string que tú inventas (ej. `n8n-verify`).
4. **Validación del Webhook (Challenge):**
   - Meta enviará una petición GET primero para verificar.
   - Tu n8n debe tener un nodo Webhook (GET) o un nodo `Respond to Webhook` que devuelva el `hub.challenge` que envía Meta.
   - *Truco:* Configura el webhook en n8n para responder con el query parameter `hub.challenge` usando una expresión: `{{ $json.query['hub.challenge'] }}`.

---

## 🤖 Alternativas No Oficiales (Waha / API de terceros)
Si no quieres usar la API oficial (por costos o complejidad de plantillas), existen soluciones como **Waha (WhatsApp HTTP API)** que corren sobre Docker y simulan un cliente web.
- **Ventaja:** No pagas por mensaje, no necesitas plantillas aprobadas.
- **Desventaja:** Riesgo de baneo si haces spam. Requiere self-hosting de la instancia de Waha.
- **Integración:** Se usa el nodo `HTTP Request` apuntando a tu servidor Waha.
