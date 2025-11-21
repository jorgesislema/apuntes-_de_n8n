# Guía Maestra de Credenciales Google (OAuth2)

Esta guía detalla el proceso universal para configurar la autenticación OAuth2 con Google Cloud Platform. Este paso es **prerrequisito obligatorio** para conectar cualquier servicio de Google (Sheets, Drive, Gmail, Calendar) con n8n de forma segura y profesional.

## ⚠️ Importante: ¿Por qué OAuth2?
Aunque existen métodos antiguos (Service Accounts), **OAuth2** es el estándar recomendado por Google y n8n porque:
1. Permite actuar en nombre de un usuario específico.
2. Es más seguro y granular con los permisos (Scopes).
3. Evita problemas comunes de "archivos compartidos" que ocurren con Service Accounts.

---

## Paso 1: Crear Proyecto en Google Cloud Console

1. Accede a [Google Cloud Console](https://console.cloud.google.com/).
2. En la barra superior, haz clic en el selector de proyectos y selecciona **"Nuevo Proyecto"**.
3. Asigna un nombre (ej: `n8n-automation-production`) y haz clic en **Crear**.
4. Asegúrate de seleccionar el nuevo proyecto creado.

## Paso 2: Habilitar APIs Necesarias

Debes habilitar explícitamente las APIs que planeas usar.

1. Ve al menú lateral > **APIs y servicios** > **Biblioteca**.
2. Busca y habilita las siguientes APIs según tus necesidades:
   - **Google Sheets API** (para hojas de cálculo)
   - **Google Drive API** (para archivos)
   - **Gmail API** (para correos)
3. Espera unos segundos a que se habiliten.

## Paso 3: Configurar Pantalla de Consentimiento OAuth

1. Ve al menú lateral > **APIs y servicios** > **Pantalla de consentimiento de OAuth**.
2. Selecciona el tipo de usuario:
   - **Interno:** Solo usuarios de tu organización (Google Workspace). *Recomendado si tienes Workspace.*
   - **Externo:** Cualquier cuenta de Google (@gmail.com). *Requerido para cuentas personales.*
3. Haz clic en **Crear**.
4. **Información de la aplicación:**
   - Nombre: `n8n Automation`
   - Correo de soporte: Tu email.
   - Logotipo: Opcional.
5. **Dominios autorizados:** Agrega el dominio donde alojas n8n (si es self-hosted) o `n8n.cloud`.
6. **Información de contacto del desarrollador:** Tu email.
7. Haz clic en **Guardar y continuar**.
8. **Permisos (Scopes):** Puedes saltar este paso por ahora (se definen en n8n).
9. **Usuarios de prueba (Solo si elegiste "Externo"):**
   - Agrega tu propia dirección de correo electrónico para poder probar la conexión.
   - *Nota: Si no te agregas aquí, la conexión fallará con error 403.*

## Paso 4: Crear Credenciales (Client ID y Secret)

1. Ve al menú lateral > **APIs y servicios** > **Credenciales**.
2. Haz clic en **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**.
3. **Tipo de aplicación:** Selecciona **Aplicación web**.
4. **Nombre:** `n8n Client`.
5. **Orígenes autorizados de JavaScript:**
   - Tu URL base de n8n (ej: `https://n8n.miempresa.com` o `http://localhost:5678`).
6. **URI de redireccionamiento autorizados:**
   - Esta URL la obtienes desde n8n al crear la credencial, pero generalmente sigue este formato:
   - `https://n8n.miempresa.com/rest/oauth2-credential/callback`
   - `http://localhost:5678/rest/oauth2-credential/callback`
   - *Copia esto exactamente de la ventana de credenciales de n8n.*
7. Haz clic en **Crear**.
8. **¡IMPORTANTE!** Se mostrará una ventana con:
   - **ID de cliente**
   - **Secreto de cliente**
   - Copia ambos valores en un lugar seguro (o descarga el JSON).

---

## Paso 5: Conectar en n8n

1. En n8n, abre el nodo de Google que deseas usar.
2. En "Credential", selecciona **Create New**.
3. Elige el tipo **Google OAuth2 API**.
4. Pega el **Client ID** y **Client Secret** obtenidos en el paso 4.
5. Haz clic en **Connect my account**.
6. Se abrirá una ventana emergente de Google:
   - Selecciona tu cuenta.
   - Si ves una advertencia de "Google no ha verificado esta aplicación", haz clic en **Configuración avanzada** > **Ir a n8n Automation (no seguro)**. *Esto es normal porque es tu propia app privada.*
   - Concede los permisos solicitados.
7. Si todo sale bien, verás el mensaje "Connection tested successfully".

---

## Solución de Problemas Comunes

### Error 403: access_denied
- **Causa:** Tu correo no está en la lista de "Usuarios de prueba" (si la app está en modo Testing).
- **Solución:** Ve a la Pantalla de consentimiento en Google Cloud y agrega tu email.

### Error: redirect_uri_mismatch
- **Causa:** La URL de callback en Google Cloud no coincide *exactamente* con la que n8n está usando.
- **Solución:** Verifica http vs https, puertos, y barras finales. Copia la URL directamente desde la interfaz de n8n.

### Error: API not enabled
- **Causa:** Intentas usar Sheets pero no habilitaste la "Google Sheets API" en el Paso 2.
- **Solución:** Ve a la Biblioteca de APIs y habilítala.
