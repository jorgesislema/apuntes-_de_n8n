# Integración con Microsoft 365 en n8n

La suite de Microsoft 365 (anteriormente Office 365) es fundamental en entornos corporativos. n8n ofrece nodos nativos para los servicios más populares, pero la configuración de seguridad (Azure AD) suele ser el mayor obstáculo.

## Servicios Principales

### 1. Microsoft Outlook
Permite enviar correos, gestionar borradores y reaccionar a correos entrantes.
- **Nodos:** `Microsoft Outlook`.
- **Triggers:** `Microsoft Outlook Trigger` (revisa la bandeja de entrada periódicamente).

### 2. Microsoft Teams
Vital para notificaciones corporativas y ChatOps.
- **Nodos:** `Microsoft Teams`.
- **Funcionalidades:** Enviar mensajes a canales, chats privados, crear reuniones.

### 3. Microsoft Excel Online
Manipulación de hojas de cálculo en la nube (OneDrive/SharePoint).
- **Nodos:** `Microsoft Excel`.
- **Diferencia con Google Sheets:** Excel Online requiere que el archivo esté en OneDrive for Business o SharePoint. La API es un poco más estricta con los formatos de tabla.

---

## 🔐 Autenticación (Azure Active Directory)

La mayoría de los nodos de Microsoft usan **OAuth2**. Para conectarlos, necesitas registrar una aplicación en Azure Portal.

### Pasos para obtener Credenciales (App Registration)

1. Ve a [Azure Portal](https://portal.azure.com/) > **App registrations**.
2. Crea una **New registration**.
   - Name: `n8n-integration`
   - Supported account types: `Accounts in any organizational directory (Any Azure AD directory - Multitenant)` (usualmente lo más fácil para pruebas) o `Single tenant` (para uso interno estricto).
   - Redirect URI (Web): `https://tu-instancia-n8n.com/rest/oauth2-credential/callback`
3. Copia el **Application (client) ID**.
4. En **Certificates & secrets**, crea un **New client secret**. Copia el "Value" (no el ID).
5. En **API Permissions**, añade los permisos necesarios (Delegated):
   - `Mail.ReadWrite`, `Mail.Send` (Outlook)
   - `Files.ReadWrite` (Excel/OneDrive)
   - `User.Read` (Básico)
   - `Offline_access` (Para mantener la conexión viva).

### Configuración en n8n
En la credencial OAuth2 de Microsoft:
- **Client ID:** (De paso 3)
- **Client Secret:** (De paso 4)
- **Auth URL:** `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`
- **Token URL:** `https://login.microsoftonline.com/common/oauth2/v2.0/token`
- **Scope:** `openid offline_access User.Read Mail.ReadWrite Mail.Send Files.ReadWrite` (separados por espacios).

---

## ⚠️ Problemas Comunes

1. **Token Expiry:** Los tokens de Microsoft duran poco (60-90 min). n8n los refresca automáticamente si tienes el permiso `offline_access`. Si falla, reconecta la cuenta.
2. **Excel Tables:** Para leer/escribir en Excel, los datos **deben estar dentro de una "Tabla"** (Insertar > Tabla). No puedes escribir en celdas sueltas arbitrarias tan fácilmente como en Google Sheets.
3. **Throttling:** La API de Microsoft Graph tiene límites de velocidad estrictos. Usa el nodo `Wait` si procesas muchos correos.
