# Manejo de Datos y Expresiones en n8n

## Introducción - La Guía Definitiva

El manejo de datos en n8n es como aprender un nuevo idioma. Al principio parece complicado, pero una vez que entiendes las reglas básicas, puedes crear conversaciones increíbles entre tus aplicaciones.

**Ejemplo:** Es como aprender a interpretar las variables y parámetros en un sistema. Una vez que sabes cómo funcionan, puedes navegar y manipular cualquier flujo de datos.

## ¿Qué son las Expresiones?

**Concepto:** Las expresiones son fórmulas que le dicen a n8n cómo trabajar con los datos que fluyen por tu workflow.

**Ejemplo:** Es como una función de procesamiento. Le proporcionas parámetros de entrada (datos), aplicas una lógica específica (expresión), y obtienes un resultado procesado (nueva información).

## Sintaxis Básica de Expresiones

### Estructura General
```javascript
{{ expresión_aquí }}
```

**Ejemplo simple:**
```javascript
{{ $json.nombre }}
```

**Explicación:** Los dos símbolos `{{` y `}}` son como paréntesis que le dicen a n8n "¡Oye! Esto es una expresión, no texto normal."

## Variables Fundamentales

### 1. $json - Los Datos del Item Actual

**Concepto:** `$json` es como una caja que contiene toda la información del item que se está procesando en ese momento.

**Ejemplo:** Si tienes un objeto de datos, `$json` sería todo el objeto completo, y `$json.nombre` sería una propiedad específica dentro de ese objeto.

**Uso práctico:**
```javascript
{{ $json.nombre }}          // Obtiene el nombre
{{ $json.email }}           // Obtiene el email
{{ $json.edad }}            // Obtiene la edad
{{ $json.direccion.calle }} // Obtiene la calle de la dirección
```

### 2. $item - Información Completa del Item

**Concepto:** `$item` es como tener acceso a toda la ficha técnica de un producto, no solo a su contenido.

**Diferencia con $json:**
- `$json` = Solo el contenido
- `$item` = El contenido + información adicional

**Ejemplo práctico:**
```javascript
{{ $item.json.nombre }}     // Igual que $json.nombre
{{ $item.index }}           // Posición del item (0, 1, 2...)
{{ $item.binary }}          // Archivos adjuntos
```

### 3. $items - Todos los Items Disponibles

**Concepto:** `$items` es como tener acceso a toda la biblioteca, no solo al libro que estás leyendo.

**Ejemplo:** Si estás procesando una base de datos, `$json` sería el registro actual que estás analizando, pero `$items` sería toda la colección de registros.

**Uso práctico:**
```javascript
{{ $items.length }}         // Cuántos items hay en total
{{ $items[0].json.nombre }} // Nombre del primer item
{{ $items[1].json.edad }}   // Edad del segundo item
```

### 4. $runIndex - Número de Ejecución

**Concepto:** `$runIndex` es como un contador que te dice cuántas veces se ha ejecutado tu workflow.

**Ejemplo:** Es como contar cuántas veces has ejecutado una misma operación en un bucle.

**Uso práctico:**
```javascript
{{ $runIndex }}             // 0, 1, 2, 3... (empieza en 0)
```

### 5. $itemIndex - Posición del Item

**Concepto:** `$itemIndex` te dice la posición del item actual en la lista.

**Ejemplo:** Si estás procesando una lista, `$itemIndex` te dice la posición actual del elemento: 0 para el primero, 1 para el segundo, etc.

**Uso práctico:**
```javascript
{{ $itemIndex }}            // 0, 1, 2, 3... (empieza en 0)
```

## Operaciones Básicas

### 1. Concatenación (Unir Textos)
```javascript
{{ $json.nombre + " " + $json.apellido }}
// Juan + " " + Pérez = "Juan Pérez"
```

### 2. Matemáticas
```javascript
{{ $json.precio * 1.21 }}     // Agregar IVA 21%
{{ $json.edad + 1 }}          // Sumar 1 a la edad
{{ $json.total - $json.descuento }} // Calcular precio final
```

### 3. Comparaciones
```javascript
{{ $json.edad >= 18 }}        // true o false
{{ $json.estado == "activo" }} // true o false
{{ $json.precio > 100 }}      // true o false
```

## Funciones Útiles

### 1. Trabajar con Texto

#### Convertir a Mayúsculas
```javascript
{{ $json.nombre.toUpperCase() }}
// "juan" → "JUAN"
```

#### Convertir a Minúsculas
```javascript
{{ $json.email.toLowerCase() }}
// "JUAN@EJEMPLO.COM" → "juan@ejemplo.com"
```

#### Obtener Parte de un Texto
```javascript
{{ $json.nombre.substring(0, 3) }}
// "Juan" → "Jua"
```

#### Reemplazar Texto
```javascript
{{ $json.telefono.replace("-", "") }}
// "123-456-789" → "123456789"
```

### 2. Trabajar con Fechas

#### Fecha Actual
```javascript
{{ new Date().toISOString() }}
// "2024-07-09T10:30:00.000Z"
```

#### Fecha Formateada
```javascript
{{ new Date().toLocaleDateString('es-ES') }}
// "09/07/2024"
```

#### Agregar Días
```javascript
{{ new Date(Date.now() + 86400000).toISOString() }}
// Fecha de mañana
```

### 3. Trabajar con Listas

#### Obtener el Primer Elemento
```javascript
{{ $json.productos[0] }}
```

#### Obtener el Último Elemento
```javascript
{{ $json.productos[$json.productos.length - 1] }}
```

#### Verificar si Existe
```javascript
{{ $json.productos.includes("laptop") }}
// true o false
```

## Condicionales (If-Then-Else)

### Estructura Básica
```javascript
{{ condición ? valor_si_verdadero : valor_si_falso }}
```

### Ejemplos Prácticos

#### Clasificar por Edad
```javascript
{{ $json.edad < 18 ? "Menor" : "Adulto" }}
```

#### Aplicar Descuento
```javascript
{{ $json.cantidad > 10 ? $json.precio * 0.9 : $json.precio }}
```

#### Mensaje Personalizado
```javascript
{{ $json.vip ? "Estimado cliente VIP" : "Estimado cliente" }}
```

## Trabajar con Objetos Complejos

### Acceder a Propiedades Anidadas
```javascript
// Si tienes: {"cliente": {"direccion": {"calle": "Main St"}}}
{{ $json.cliente.direccion.calle }}
```

### Trabajar con Arrays
```javascript
// Si tienes: {"productos": [{"nombre": "Laptop"}, {"nombre": "Mouse"}]}
{{ $json.productos[0].nombre }}        // "Laptop"
{{ $json.productos.length }}           // 2
```

## Funciones Avanzadas

### 1. JSON.stringify() - Convertir a Texto
```javascript
{{ JSON.stringify($json) }}
// Convierte el objeto completo a texto
```

### 2. JSON.parse() - Convertir de Texto
```javascript
{{ JSON.parse($json.datos_json) }}
// Convierte texto JSON a objeto
```

### 3. Math - Operaciones Matemáticas
```javascript
{{ Math.round($json.precio) }}         // Redondear
{{ Math.max($json.precio1, $json.precio2) }} // Máximo
{{ Math.min($json.precio1, $json.precio2) }} // Mínimo
```

## Ejemplos Prácticos del Mundo Real

### 1. Crear un Mensaje de Bienvenida
```javascript
{{ "¡Hola " + $json.nombre + "! Te damos la bienvenida a nuestro servicio." }}
```

### 2. Calcular Precio con Descuento
```javascript
{{ $json.precio * (1 - $json.descuento_porcentaje / 100) }}
```

### 3. Formatear Número de Teléfono
```javascript
{{ $json.telefono.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") }}
```

### 4. Generar ID Único
```javascript
{{ Date.now() + "-" + Math.random().toString(36).substr(2, 9) }}
```

## Errores Comunes y Soluciones

### Error: "Cannot read property 'nombre' of undefined"
**Problema:** El objeto no existe o es null
**Solución:**
```javascript
{{ $json.cliente?.nombre || "Sin nombre" }}
```

### Error: "Unexpected token"
**Problema:** Sintaxis incorrecta
**Solución:** Verifica que tengas `{{` y `}}` correctos

### Error: "Cannot convert undefined to object"
**Problema:** Tratas de acceder a propiedades de algo que no existe
**Solución:** Usa verificaciones:
```javascript
{{ $json.datos ? $json.datos.nombre : "No disponible" }}
```

## Consejos y Mejores Prácticas

### 1. Usa Nombres Descriptivos
❌ **Malo:**
```javascript
{{ $json.a + $json.b }}
```

✅ **Bueno:**
```javascript
{{ $json.precio_base + $json.impuestos }}
```

### 2. Maneja Valores Nulos
```javascript
{{ $json.nombre || "Sin nombre" }}
{{ $json.edad ?? 0 }}
```

### 3. Comenta Expresiones Complejas
```javascript
// En el campo "Notes" del nodo:
// Esta expresión calcula el precio final con descuento e impuestos
{{ ($json.precio * (1 - $json.descuento)) * (1 + $json.impuesto) }}
```

## Archivos de Práctica

En esta carpeta encontrarás:

1. **[01_Accediendo_a_Datos.md](./01_Accediendo_a_Datos.md)** - Guía detallada de variables
2. **[02_Transformando_Data_con_Set.json](./02_Transformando_Data_con_Set.json)** - Ejemplos prácticos
3. **[03_Expresiones_Avanzadas_JMESPath.md](./03_Expresiones_Avanzadas_JMESPath.md)** - Técnicas avanzadas
4. **[04_Ejemplos_de_Expresiones.json](./04_Ejemplos_de_Expresiones.json)** - Casos de uso reales

## Próximos Pasos

1. Practica con los ejemplos incluidos
2. Experimenta con diferentes tipos de datos
3. Aprende sobre [Workflows Avanzados](../03_Workflows_Avanzados_y_Patrones/)
4. Explora [El Nodo Code](../04_El_Nodo_Code/)

---

**Recuerda:** Las expresiones son como aprender a tocar un instrumento. Al principio tocas notas individuales, pero con práctica puedes crear melodías increíbles. ¡Cada expresión que domines te acerca más a ser un maestro de la automatización! 🎵
