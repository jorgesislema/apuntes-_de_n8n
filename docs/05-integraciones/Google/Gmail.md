# Gmail en n8n

El nodo de Gmail permite enviar correos, leer la bandeja de entrada, gestionar etiquetas y responder hilos automáticamente.

## 🔐 Configuración de Credenciales

Este nodo requiere autenticación OAuth2.
👉 **[Ver Guía Maestra de Credenciales Google](./00_Guia_Maestra_Credenciales.md)**

### Scopes Requeridos
- `https://mail.google.com/` (Acceso completo - necesario para borrar/modificar)
- `https://www.googleapis.com/auth/gmail.send` (Solo enviar)
- `https://www.googleapis.com/auth/gmail.readonly` (Solo leer)

---

## ⚙️ Operaciones Principales

### 1. Send (Enviar Correo)
Envía emails con soporte para HTML y adjuntos.
- **HTML:** Puedes diseñar correos ricos visualmente usando HTML/CSS inline.
- **Adjuntos:** Mapea la propiedad binaria de un nodo anterior para adjuntar archivos dinámicamente.

### 2. Get Many (Leer Correos)
Recupera correos basados en filtros.
- **Query:** Usa la misma sintaxis que la barra de búsqueda de Gmail.
    - Ej: `is:unread from:cliente@empresa.com`
    - Ej: `subject:(factura OR presupuesto) after:2024/01/01`
- **Importante:** Por defecto descarga solo metadatos. Debes activar "Download Attachments" si necesitas los archivos.

### 3. Reply (Responder)
Responde a un hilo existente.
- **Requisito:** Necesitas el `Thread ID` del correo original.
- **Ventaja:** Mantiene la conversación agrupada en el cliente de correo del destinatario.

---

## 🚀 Buenas Prácticas

### Evitar Spam
Si usas Gmail para marketing masivo, te bloquearán.
- **Límite:** Gmail personal tiene un límite de ~500 correos/día. Workspace ~2000.
- **Alternativa:** Para newsletters o transaccionales masivos, usa **SendGrid**, **Mailgun** o **Amazon SES**. Gmail es para comunicación personal/empresarial directa.

### Gestión de "Leídos"
Al procesar correos (ej. "Procesar facturas no leídas"), asegúrate de añadir un paso final que **marque el correo como leído** o le asigne una etiqueta "Procesado". Si no, tu workflow procesará el mismo correo infinitamente en cada ejecución.

---

## 🔧 Solución de Errores

### "Too many concurrent requests for user"
- **Causa:** Estás ejecutando demasiados workflows paralelos que acceden a la misma cuenta de Gmail.
- **Solución:** Usa el nodo "Split In Batches" o reduce la frecuencia de ejecución.

### "Invalid attachment"
- **Causa:** Intentas enviar un archivo binario que no existe o está corrupto en el flujo de datos.
- **Solución:** Verifica que el nodo anterior realmente descargó el archivo correctamente.
