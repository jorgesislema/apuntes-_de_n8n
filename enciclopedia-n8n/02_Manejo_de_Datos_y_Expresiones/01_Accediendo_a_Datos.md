# Accediendo a Datos en n8n - Guía Completa

## Variables Fundamentales Explicadas

### $json - Tu Mejor Amigo

**Concepto:** `$json` es la variable más importante en n8n. Contiene todos los datos del item actual que se está procesando.

**Ejemplo:** Imagina que cada item es un registro en una base de datos. `$json` sería toda la información de ese registro específico.

#### Estructura Típica de $json
```javascript
{
  "nombre": "Juan Pérez",
  "edad": 30,
  "email": "juan@ejemplo.com",
  "direccion": {
    "calle": "Av. Principal 123",
    "ciudad": "Madrid",
    "codigo_postal": "28001"
  },
  "intereses": ["tecnología", "deportes", "música"],
  "activo": true
}
```

#### Accediendo a Propiedades
```javascript
{{ $json.nombre }}              // "Juan Pérez"
{{ $json.edad }}                // 30
{{ $json.direccion.ciudad }}    // "Madrid"
{{ $json.intereses[0] }}        // "tecnología"
{{ $json.activo }}              // true
```

### $item - Información Completa del Item

**Concepto:** `$item` es como tener acceso al expediente completo de un paciente, no solo a su síntoma actual.

#### Estructura de $item
```javascript
{
  "json": {
    // Los mismos datos que $json
  },
  "binary": {
    // Archivos adjuntos como imágenes, PDFs, etc.
  },
  "index": 0,  // Posición del item en la lista
  "pairedItem": {
    // Información sobre el item que generó este item
  }
}
```

#### Ejemplos Prácticos
```javascript
{{ $item.json.nombre }}         // Igual que $json.nombre
{{ $item.index }}               // 0, 1, 2, 3... (posición)
{{ $item.binary.archivo }}      // Acceso a archivos adjuntos
```

### $items - Todos los Items Disponibles

**Concepto:** `$items` es como tener acceso a todo el álbum de fotos, no solo a la foto que estás viendo.

#### Cuándo Usar $items
1. **Contar elementos:** `{{ $items.length }}`
2. **Acceder a otros items:** `{{ $items[0].json.nombre }}`
3. **Crear resúmenes:** Procesar múltiples items a la vez

#### Ejemplos Prácticos
```javascript
// Contar total de items
{{ $items.length }}

// Obtener el primer item
{{ $items[0].json.nombre }}

// Obtener el último item
{{ $items[$items.length - 1].json.nombre }}

// Sumar todos los precios
{{ $items.reduce((sum, item) => sum + item.json.precio, 0) }}
```

### $runIndex - Contador de Ejecuciones

**Concepto:** Es como un odómetro que cuenta cuántas veces se ha ejecutado tu workflow.

#### Casos de Uso
```javascript
// Crear IDs únicos
{{ "ejecucion-" + $runIndex }}

// Logs con número de ejecución
{{ "Esta es la ejecución #" + $runIndex }}

// Lógica basada en número de ejecución
{{ $runIndex % 10 === 0 ? "Cada 10 ejecuciones" : "Ejecución normal" }}
```

### $itemIndex - Posición del Item Actual

**Concepto:** Te dice qué posición ocupa el item actual en la lista.

#### Ejemplos Prácticos
```javascript
// Numerar elementos
{{ ($itemIndex + 1) + ". " + $json.nombre }}

// Procesar solo items pares
{{ $itemIndex % 2 === 0 ? "Par" : "Impar" }}

// Agregar separadores
{{ $itemIndex > 0 ? ", " + $json.nombre : $json.nombre }}
```

## Variables Avanzadas

### $now - Fecha y Hora Actual

**Concepto:** Siempre contiene la fecha y hora exacta de cuando se ejecuta el workflow.

```javascript
{{ $now }}                      // 2024-07-09T10:30:00.000Z
{{ $now.toISOString() }}        // Formato ISO completo
{{ $now.toLocaleDateString() }} // 09/07/2024
{{ $now.getFullYear() }}        // 2024
{{ $now.getMonth() + 1 }}       // 7 (mes actual)
{{ $now.getDate() }}            // 9 (día actual)
```

### $today - Solo la Fecha Actual

**Concepto:** Como $now, pero solo la fecha sin la hora.

```javascript
{{ $today }}                    // 2024-07-09
{{ $today.toISOString() }}      // 2024-07-09T00:00:00.000Z
```

### $workflow - Información del Workflow

**Concepto:** Contiene metadatos sobre el workflow que se está ejecutando.

```javascript
{{ $workflow.id }}              // ID único del workflow
{{ $workflow.name }}            // Nombre del workflow
{{ $workflow.active }}          // true/false si está activo
```

### $execution - Información de la Ejecución

**Concepto:** Datos sobre la ejecución actual del workflow.

```javascript
{{ $execution.id }}             // ID único de esta ejecución
{{ $execution.mode }}           // "manual", "trigger", etc.
{{ $execution.startedAt }}      // Cuándo empezó la ejecución
```

## Acceso a Datos de Nodos Anteriores

### $("nombre_del_nodo") - Datos de Nodo Específico

**Concepto:** Te permite acceder a datos de cualquier nodo anterior, no solo el inmediato.

```javascript
// Acceder al nodo "Obtener Cliente"
{{ $("Obtener Cliente").json.nombre }}

// Acceder al primer item del nodo "Lista Productos"
{{ $("Lista Productos").first().json.precio }}

// Acceder a todos los items del nodo "Procesar Pedidos"
{{ $("Procesar Pedidos").all() }}
```

### Métodos Útiles para Nodos
```javascript
// Obtener solo el primer item
{{ $("Mi Nodo").first().json.dato }}

// Obtener solo el último item
{{ $("Mi Nodo").last().json.dato }}

// Obtener todos los items
{{ $("Mi Nodo").all() }}

// Obtener un item específico por posición
{{ $("Mi Nodo").itemMatching(0).json.dato }}
```

## Casos de Uso Prácticos

### 1. Crear Mensajes Personalizados
```javascript
// Saludo personalizado
{{ "¡Hola " + $json.nombre + "!" }}

// Mensaje con múltiples datos
{{ $json.nombre + " (" + $json.edad + " años) vive en " + $json.ciudad }}

// Condicional basado en datos
{{ $json.edad >= 18 ? "Adulto" : "Menor de edad" }}
```

### 2. Procesar Listas y Arrays
```javascript
// Primer elemento de una lista
{{ $json.productos[0].nombre }}

// Último elemento de una lista
{{ $json.productos[$json.productos.length - 1].nombre }}

// Unir elementos de una lista
{{ $json.intereses.join(", ") }}

// Verificar si existe en la lista
{{ $json.productos.includes("laptop") }}
```

### 3. Trabajar con Fechas
```javascript
// Formatear fecha de nacimiento
{{ new Date($json.fecha_nacimiento).toLocaleDateString("es-ES") }}

// Calcular edad
{{ Math.floor((Date.now() - new Date($json.fecha_nacimiento)) / (365.25 * 24 * 60 * 60 * 1000)) }}

// Fecha de vencimiento (30 días)
{{ new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }}
```

### 4. Matemáticas y Cálculos
```javascript
// Calcular precio con descuento
{{ $json.precio * (1 - $json.descuento / 100) }}

// Calcular IVA
{{ $json.subtotal * 0.21 }}

// Calcular promedio
{{ $items.reduce((sum, item) => sum + item.json.valor, 0) / $items.length }}
```

## Trucos y Consejos Avanzados

### 1. Valores por Defecto
```javascript
// Si no existe nombre, usar "Sin nombre"
{{ $json.nombre || "Sin nombre" }}

// Para números, usar 0 como defecto
{{ $json.precio ?? 0 }}

// Para objetos anidados
{{ $json.direccion?.calle || "Sin dirección" }}
```

### 2. Verificaciones de Existencia
```javascript
// Verificar si existe una propiedad
{{ $json.hasOwnProperty('email') }}

// Verificar si es un array
{{ Array.isArray($json.productos) }}

// Verificar si un string no está vacío
{{ $json.nombre && $json.nombre.trim() !== "" }}
```

### 3. Transformaciones Complejas
```javascript
// Crear un objeto nuevo
{{ {
  "nombre_completo": $json.nombre + " " + $json.apellido,
  "edad_en_meses": $json.edad * 12,
  "email_dominio": $json.email.split("@")[1]
} }}

// Filtrar y mapear arrays
{{ $json.productos.filter(p => p.precio > 100).map(p => p.nombre) }}
```

## Debugging y Solución de Problemas

### 1. Ver Estructura de Datos
```javascript
// Ver todo el objeto JSON
{{ JSON.stringify($json, null, 2) }}

// Ver tipo de dato
{{ typeof $json.precio }}

// Ver longitud de arrays
{{ $json.productos?.length || 0 }}
```

### 2. Validar Datos
```javascript
// Verificar que no sea null o undefined
{{ $json.nombre != null }}

// Verificar que sea un número
{{ !isNaN($json.edad) }}

// Verificar formato de email
{{ /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($json.email) }}
```

### 3. Errores Comunes
```javascript
// ❌ Error: Acceso a propiedad inexistente
{{ $json.datos.nombre }}

// ✅ Correcto: Con verificación
{{ $json.datos?.nombre || "No disponible" }}

// ❌ Error: Array vacío
{{ $json.productos[0].nombre }}

// ✅ Correcto: Con verificación
{{ $json.productos?.length > 0 ? $json.productos[0].nombre : "Sin productos" }}
```

## Próximos Pasos

1. Practica con diferentes tipos de datos
2. Experimenta con [Transformaciones con Set](./02_Transformando_Data_con_Set.json)
3. Aprende sobre [Expresiones Avanzadas](./03_Expresiones_Avanzadas_JMESPath.md)
4. Explora [Ejemplos Prácticos](./04_Ejemplos_de_Expresiones.json)

---

**Recuerda:** Acceder a datos en n8n requiere familiarizarse con las diferentes variables del sistema ($json, $items, $now, etc.). Una vez que domines estas estructuras, podrás extraer cualquier información que necesites de manera eficiente. La práctica constante es clave para el dominio.
