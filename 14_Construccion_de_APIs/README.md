# 🌐 Módulo 14: Construcción de APIs con n8n

n8n no solo consume APIs, también puede actuar como un backend completo.

## Contenido
1. **Webhooks como Triggers**
   - Métodos HTTP (GET, POST, PUT, DELETE).
   - Autenticación (Header Auth, Basic Auth).
2. **Respuestas Personalizadas**
   - Nodo `Respond to Webhook`.
   - Devolver JSON, HTML o Binarios (imágenes/PDFs).
3. **Seguridad**
   - Validación de firmas HMAC (ej. Stripe, GitHub).
   - Filtrado de IPs.

## Guía Rápida

### Configuración del Webhook
- **Path:** Define la URL final (ej. `https://n8n.mi-dominio.com/webhook/mi-api`).
- **Method:** `POST` es lo estándar para recibir datos. `GET` para consultas simples.
- **Response Mode:**
  - `On Received`: Responde "200 OK" inmediatamente (bueno para colas).
  - `Last Node`: Espera a que termine el flujo para responder (bueno para APIs síncronas).

### Validación HMAC (Ejemplo Conceptual)
Para verificar que un webhook viene realmente de quien dice ser (ej. GitHub), se usa un hash.

1. Recibir el header `X-Hub-Signature-256`.
2. Usar el nodo `Crypto` para hashear el `body` con tu `SECRET`.
3. Comparar el hash generado con el del header.

```javascript
// Validación en nodo Code
const crypto = require('crypto');
const secret = 'mi_secreto_super_seguro';
const signature = $input.headers['x-hub-signature-256'];
const body = JSON.stringify($input.body);

const hash = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');

if (hash !== signature) {
  throw new Error('Firma inválida!');
}
return $input.item;
```
