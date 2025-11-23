# Google Sheets en n8n

El nodo de Google Sheets permite leer, escribir y manipular hojas de cálculo en la nube. Es una de las integraciones más utilizadas para bases de datos ligeras y reportes.

## 🔐 Configuración de Credenciales

Este nodo requiere autenticación OAuth2.
👉 **[Ver Guía Maestra de Credenciales Google](./00_Guia_Maestra_Credenciales.md)**

### Scopes Requeridos
Al conectar la cuenta, n8n solicitará automáticamente los siguientes permisos:
- `https://www.googleapis.com/auth/spreadsheets` (Lectura y escritura)
- `https://www.googleapis.com/auth/drive.readonly` (Para listar archivos)

---

## ⚙️ Operaciones Principales

### 1. Read (Leer Filas)
Lee datos de una hoja para procesarlos en el workflow.
- **Ventaja:** Convierte automáticamente las filas en items JSON.
- **Tip:** Usa la opción "Data Location > First Row is Header" para que n8n use la primera fila como nombres de las propiedades JSON.

### 2. Append (Agregar Filas)
Añade nuevos datos al final de la hoja.
- **Uso:** Guardar leads, registros de logs, respuestas de formularios.
- **Modo:** "Map Each Column to a Field" es la forma más segura de mapear datos JSON a columnas específicas.

### 3. Update (Actualizar Filas)
Modifica filas existentes.
- **Requisito:** Necesitas un identificador único (Key) para saber qué fila actualizar.
- **Estrategia:** Usa `Lookup Column` para buscar por ID (ej. Email o ID de pedido) y actualizar esa fila específica.

---

## 🚀 Buenas Prácticas y Limitaciones

### ✅ Lo que SÍ debes hacer
- **Usar IDs de Hoja:** En lugar de seleccionar el archivo por nombre (que puede cambiar), copia el ID de la URL de la hoja (`/d/1BxiM.../edit`) y úsalo como "By ID". Es más robusto.
- **Formato de Fechas:** Google Sheets es caprichoso con las fechas. Envía fechas en formato ISO o strings simples (`YYYY-MM-DD`) para evitar errores de parseo.

### ❌ Lo que NO debes hacer
- **Usarlo como Base de Datos Masiva:** Si tienes >10,000 filas, el rendimiento caerá drásticamente. Usa PostgreSQL o MySQL.
- **Lecturas Frecuentes:** Google tiene límites de API (Rate Limits). No leas la hoja cada 5 segundos; usa un intervalo de 5-15 minutos o Webhooks si es posible.

---

## 🔧 Solución de Errores Comunes

### "The caller does not have permission"
- **Causa:** La credencial es válida, pero el usuario no tiene acceso a *esa* hoja específica.
- **Solución:** Asegúrate de que la hoja esté compartida con el email de la cuenta conectada en n8n.

### "Range not found"
- **Causa:** Estás intentando escribir en una hoja (Tab) que no existe o cambiaste el nombre.
- **Solución:** Verifica el nombre de la pestaña (ej. "Hoja 1") en la parte inferior de tu Google Sheet.
