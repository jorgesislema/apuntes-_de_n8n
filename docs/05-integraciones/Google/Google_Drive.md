# Google Drive en n8n

El nodo de Google Drive permite gestionar archivos y carpetas en la nube: subir, descargar, buscar, copiar y gestionar permisos.

## 🔐 Configuración de Credenciales

Este nodo requiere autenticación OAuth2.
👉 **[Ver Guía Maestra de Credenciales Google](./00_Guia_Maestra_Credenciales.md)**

### Scopes Requeridos
- `https://www.googleapis.com/auth/drive` (Acceso completo)
- `https://www.googleapis.com/auth/drive.file` (Acceso solo a archivos creados por la app - más seguro)

---

## ⚙️ Operaciones Principales

### 1. Upload (Subir Archivo)
Sube datos binarios desde n8n a una carpeta de Drive.
- **Input:** Requiere que el nodo anterior entregue datos binarios (Binary Property).
- **Opciones:** Puedes convertir automáticamente Google Docs a PDF al descargar, o viceversa al subir.

### 2. List (Buscar Archivos)
Busca archivos usando consultas avanzadas.
- **Query String:** Usa la sintaxis de búsqueda de Drive.
    - Ej: `name contains 'factura' and mimeType = 'application/pdf'`
    - Ej: `'12345folderID' in parents` (para buscar dentro de una carpeta específica).

### 3. Download (Descargar)
Descarga un archivo para procesarlo en n8n.
- **Uso:** Procesar CSVs, leer imágenes para IA, o mover archivos a otro servicio (ej. Drive -> S3).

---

## 🚀 Buenas Prácticas

### Manejo de IDs
Al igual que en Sheets, **siempre usa IDs** para referenciar carpetas y archivos. Los nombres pueden duplicarse en Drive (puedes tener dos archivos llamados "Foto.jpg" en la misma carpeta), pero los IDs son únicos.

### Búsqueda Recursiva
El nodo "List" no busca recursivamente por defecto. Si necesitas buscar en subcarpetas, tendrás que implementar un bucle o usar una query específica.

### Permisos
Ten cuidado al usar `drive.file` vs `drive` completo. Si usas el scope restringido (`drive.file`), n8n **solo podrá ver los archivos que él mismo subió**, no los que tú subiste manualmente. Para ver todo, necesitas el scope completo.

---

## 🔧 Solución de Errores

### "File not found"
- **Causa:** El ID es incorrecto o el archivo está en la Papelera.
- **Solución:** Verifica el ID y asegúrate de que `trashed = false` en tu búsqueda.

### "Insufficient permissions"
- **Causa:** Intentas acceder a un Team Drive (Shared Drive) sin habilitar la opción.
- **Solución:** Activa el switch "Supports All Drives" en las opciones del nodo.
