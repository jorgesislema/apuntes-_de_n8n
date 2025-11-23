# Google Sheets - Guía Completa

## ¿Qué es Google Sheets?

Google Sheets es una **aplicación de hojas de cálculo basada en la nube** que permite organizar datos, realizar cálculos, crear gráficos y colaborar en tiempo real. En n8n, es uno de los nodos más versátiles para almacenar, manipular y consultar datos estructurados.

### Concepto Técnico
Google Sheets funciona como:
- **Base de datos simple**: Para almacenar información estructurada
- **Sistema de reportes**: Para generar informes automáticos
- **Dashboard colaborativo**: Para compartir datos en tiempo real
- **Interfaz de entrada**: Para recopilar datos de formularios

## Configuración Inicial

### 1. **Crear Credenciales Google**

#### Paso 1: Habilitar Google Sheets API
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita "Google Sheets API"
4. Habilita "Google Drive API" (necesario para crear archivos)

#### Paso 2: Crear Credenciales OAuth2
1. Ve a "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
2. Tipo: Web Application
3. Authorized redirect URIs: `https://tu-n8n-instance.com/rest/oauth2-credential/callback`
4. Copia Client ID y Client Secret

#### Paso 3: Configurar en n8n
1. **Credentials** → **Add Credential**
2. **Google Sheets OAuth2 API**
3. Pega Client ID y Client Secret
4. **Connect my account** → Autorizar en Google
5. **Save**

### 2. **Permisos Necesarios**

Los scopes que necesitas:
```
https://www.googleapis.com/auth/spreadsheets    # Leer/escribir sheets
https://www.googleapis.com/auth/drive.file      # Crear/acceder archivos
```

## 📋 Operaciones Principales

### 1. **Leer Datos (Read)**

#### Leer Todas las Filas
```json
{
  "operation": "read",
  "documentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheetName": "Hoja1",
  "range": "A:Z"
}
```

#### Leer Rango Específico
```json
{
  "operation": "read",
  "documentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheetName": "Ventas",
  "range": "A1:E10"
}
```

#### Leer con Filtros
```json
{
  "operation": "read",
  "documentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheetName": "Usuarios",
  "range": "A:Z",
  "filters": {
    "condition": "TEXT_CONTAINS",
    "value": "activo"
  }
}
```

### 2. **Escribir Datos (Append)**

#### Agregar Fila Simple
```json
{
  "operation": "append",
  "documentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheetName": "Registros",
  "range": "A:E",
  "values": [
    ["Juan Pérez", "juan@email.com", "2024-01-15", "Activo", "Ventas"]
  ]
}
```

#### Agregar Múltiples Filas
```json
{
  "operation": "append",
  "documentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheetName": "Inventario",
  "range": "A:D",
  "values": [
    ["Producto A", "100", "50", "2024-01-15"],
    ["Producto B", "200", "75", "2024-01-15"],
    ["Producto C", "150", "60", "2024-01-15"]
  ]
}
```

### 3. **Actualizar Datos (Update)**

#### Actualizar Celda Específica
```json
{
  "operation": "update",
  "documentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheetName": "Status",
  "range": "B5",
  "values": [["Completado"]]
}
```

#### Actualizar Rango
```json
{
  "operation": "update",
  "documentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheetName": "Precios",
  "range": "C2:C10",
  "values": [
    ["$25.99"],
    ["$35.50"],
    ["$42.75"]
  ]
}
```

### 4. **Crear Hoja Nueva (Create)**

#### Crear Spreadsheet
```json
{
  "operation": "create",
  "title": "Reporte Ventas 2024",
  "sheets": [
    {
      "properties": {
        "title": "Enero",
        "sheetType": "GRID"
      }
    },
    {
      "properties": {
        "title": "Febrero",
        "sheetType": "GRID"
      }
    }
  ]
}
```

## Casos de Uso Comunes

### 1. **Sistema de Registro de Usuarios**

#### Workflow: Webhook → Validar → Google Sheets
```javascript
// En nodo Code - Validar y preparar datos
const usuario = $json;

// Validar datos
const errors = [];
if (!usuario.nombre) errors.push('Nombre requerido');
if (!usuario.email) errors.push('Email requerido');
if (!usuario.telefono) errors.push('Teléfono requerido');

if (errors.length > 0) {
    return [{ 
        json: { 
            error: true, 
            message: errors.join(', ') 
        } 
    }];
}

// Preparar para Google Sheets
return [{
    json: {
        values: [[
            usuario.nombre,
            usuario.email,
            usuario.telefono,
            new Date().toISOString(),
            'Activo'
        ]]
    }
}];
```

### 2. **Dashboard de Ventas en Tiempo Real**

#### Workflow: Trigger → Procesar Venta → Actualizar Dashboard
```javascript
// En nodo Code - Calcular métricas
const ventas = items.map(item => item.json);

const metricas = {
    totalVentas: ventas.reduce((sum, venta) => sum + venta.monto, 0),
    cantidadVentas: ventas.length,
    promedioVenta: ventas.reduce((sum, venta) => sum + venta.monto, 0) / ventas.length,
    mejorVendedor: ventas.reduce((mejor, venta) => 
        venta.monto > (mejor.monto || 0) ? venta : mejor, {}
    ).vendedor
};

return [{
    json: {
        values: [[
            new Date().toISOString(),
            metricas.totalVentas,
            metricas.cantidadVentas,
            metricas.promedioVenta,
            metricas.mejorVendedor
        ]]
    }
}];
```

### 3. **Gestión de Inventario**

#### Workflow: Producto Vendido → Actualizar Stock → Alerta si Bajo
```javascript
// En nodo Code - Actualizar inventario
const venta = $json;

// Buscar producto en inventario (simulado)
const productos = [
    { id: 1, nombre: 'Producto A', stock: 100 },
    { id: 2, nombre: 'Producto B', stock: 50 },
    { id: 3, nombre: 'Producto C', stock: 25 }
];

const producto = productos.find(p => p.id === venta.producto_id);
if (producto) {
    producto.stock -= venta.cantidad;
    
    return [{
        json: {
            // Actualizar stock en Google Sheets
            range: `B${producto.id + 1}`, // Fila del producto
            values: [[producto.stock]],
            
            // Datos adicionales
            alertaBajoStock: producto.stock < 10,
            producto: producto.nombre,
            stockActual: producto.stock
        }
    }];
}
```

### 4. **Reportes Automáticos**

#### Workflow: Cron → Generar Reporte → Enviar Email
```javascript
// En nodo Code - Generar reporte semanal
const fechaInicio = new Date();
fechaInicio.setDate(fechaInicio.getDate() - 7);

const reporte = {
    semana: `${fechaInicio.toISOString().split('T')[0]} a ${new Date().toISOString().split('T')[0]}`,
    metricas: {
        usuariosNuevos: 45,
        ventasRealizadas: 128,
        ingresosTotales: 15420.50,
        tasaConversion: 12.5
    }
};

return [{
    json: {
        values: [[
            reporte.semana,
            reporte.metricas.usuariosNuevos,
            reporte.metricas.ventasRealizadas,
            reporte.metricas.ingresosTotales,
            reporte.metricas.tasaConversion
        ]]
    }
}];
```

## 🛠️ Técnicas Avanzadas

### 1. **Formato Condicional**

#### Aplicar Colores por Valor
```javascript
// En nodo Code - Preparar datos con formato
const datos = items.map(item => {
    const valor = item.json.cantidad;
    let color = 'white';
    
    if (valor < 10) color = 'red';
    else if (valor < 50) color = 'yellow';
    else color = 'green';
    
    return {
        value: valor,
        format: {
            backgroundColor: color,
            textColor: valor < 10 ? 'white' : 'black'
        }
    };
});
```

### 2. **Fórmulas Dinámicas**

#### Crear Fórmulas en Celdas
```javascript
// En nodo Code - Generar fórmulas
const formulas = [
    ['=SUM(B2:B10)'],           // Suma total
    ['=AVERAGE(B2:B10)'],       // Promedio
    ['=MAX(B2:B10)'],           // Máximo
    ['=MIN(B2:B10)'],           // Mínimo
    ['=COUNT(B2:B10)']          // Contar
];

return [{
    json: {
        range: 'D2:D6',
        values: formulas
    }
}];
```

### 3. **Validación de Datos**

#### Crear Listas Desplegables
```javascript
// Configurar validación en Google Sheets API
const validationRule = {
    condition: {
        type: 'ONE_OF_LIST',
        values: [
            { userEnteredValue: 'Activo' },
            { userEnteredValue: 'Inactivo' },
            { userEnteredValue: 'Pendiente' }
        ]
    },
    showCustomUi: true
};
```

### 4. **Gráficos Automáticos**

#### Crear Gráfico de Barras
```javascript
// En nodo Code - Preparar datos para gráfico
const datosGrafico = {
    type: 'COLUMN',
    title: 'Ventas por Mes',
    data: {
        range: 'A1:B13',
        headers: ['Mes', 'Ventas']
    }
};

return [{
    json: {
        addChart: datosGrafico
    }
}];
```

## 📊 Optimización y Performance

### 1. **Leer Datos Eficientemente**

#### Usar Rangos Específicos
```javascript
// ❌ Ineficiente - Lee toda la hoja
const range = 'A:Z';

// ✅ Eficiente - Solo lo necesario
const range = 'A1:E100';
```

#### Batch Reading
```javascript
// Leer múltiples rangos en una sola llamada
const ranges = [
    'A1:E10',    // Datos principales
    'G1:J5',     // Métricas
    'L1:N3'      // Configuración
];
```

### 2. **Escribir Datos en Lotes**

#### Acumular Cambios
```javascript
// En nodo Code - Acumular múltiples operaciones
const operations = [];

// Agregar datos
operations.push({
    operation: 'append',
    range: 'A:E',
    values: newData
});

// Actualizar fórmulas
operations.push({
    operation: 'update',
    range: 'F2:F10',
    values: formulas
});

// Ejecutar todas las operaciones
return operations.map(op => ({ json: op }));
```

### 3. **Caché de Datos**

#### Evitar Lecturas Repetitivas
```javascript
// Guardar datos en memoria durante el workflow
const cache = {
    productos: null,
    lastUpdate: null
};

// Solo leer si el cache está vacío o es muy viejo
if (!cache.productos || (Date.now() - cache.lastUpdate) > 300000) {
    cache.productos = await readFromSheet();
    cache.lastUpdate = Date.now();
}
```

## 🚨 Manejo de Errores

### 1. **Errores Comunes**

#### Error de Permisos
```javascript
// Error: "The caller does not have permission"
// Solución: Verificar que el archivo esté compartido con la cuenta de servicio
```

#### Error de Rango
```javascript
// Error: "Unable to parse range"
// Solución: Verificar formato de rango (A1:E10)
```

#### Error de Cuota
```javascript
// Error: "Quota exceeded"
// Solución: Implementar retry con delay
```

### 2. **Manejo Robusto**

#### Try-Catch con Retry
```javascript
const MAX_RETRIES = 3;
let retries = 0;

while (retries < MAX_RETRIES) {
    try {
        const result = await writeToSheet(data);
        return result;
    } catch (error) {
        retries++;
        if (retries >= MAX_RETRIES) {
            throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
}
```

## 📋 Checklist de Buenas Prácticas

### ✅ Configuración
- [ ] Credenciales OAuth2 configuradas correctamente
- [ ] Permisos mínimos necesarios
- [ ] Sheets compartidos con la cuenta correcta
- [ ] Nombres de hojas y rangos documentados

### ✅ Performance
- [ ] Usar rangos específicos, no toda la hoja
- [ ] Agrupar operaciones en lotes
- [ ] Implementar caché cuando sea apropiado
- [ ] Validar datos antes de escribir

### ✅ Mantenimiento
- [ ] Documentar estructura de datos
- [ ] Implementar manejo de errores
- [ ] Logging para debugging
- [ ] Backup de datos importantes

### ✅ Seguridad
- [ ] No hardcodear IDs de documentos
- [ ] Validar permisos de usuario
- [ ] Sanitizar datos de entrada
- [ ] Auditoría de accesos

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Sistema de Encuestas
Crea un workflow que:
1. Reciba respuestas de encuesta vía webhook
2. Valide las respuestas
3. Guarde en Google Sheets
4. Genere estadísticas automáticamente

### Ejercicio 2: Dashboard de Métricas
Crea un workflow que:
1. Lea datos de múltiples fuentes
2. Calcule métricas clave
3. Actualice un dashboard en Google Sheets
4. Envíe alertas si hay problemas

### Ejercicio 3: Gestión de Proyectos
Crea un workflow que:
1. Rastree tareas de un proyecto
2. Actualice progreso automáticamente
3. Genere reportes de estado
4. Notifique hitos importantes

---

**Recuerda:** Google Sheets es una herramienta poderosa para manejar datos estructurados. Úsalo como base de datos simple, herramienta de reportes o dashboard interactivo. La clave está en organizarte bien y usar las funciones correctas para cada situación.
