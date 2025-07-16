# El Nodo Code - Tu Superpoder en n8n

## Introducción

El nodo Code es como tener un genio en una lámpara que puede hacer cualquier cosa que imagines. Es el nodo más poderoso de n8n porque te permite escribir código JavaScript personalizado.

**Ejemplo:** Imagina que tienes acceso completo a un intérprete de JavaScript que puede ejecutar cualquier lógica personalizada que necesites. El nodo Code es esa herramienta poderosa para n8n.

## ¿Cuándo Usar el Nodo Code?

### ✅ Úsalo Cuando:
- Los nodos normales no pueden hacer lo que necesitas
- Necesitas lógica compleja que involucra múltiples pasos
- Quieres transformar datos de manera muy específica
- Necesitas integrar con APIs o servicios sin nodo dedicado
- Quieres crear funciones reutilizables

### ❌ No lo Uses Cuando:
- Existe un nodo específico que hace lo que necesitas
- La tarea es simple y puede hacerse con nodos básicos
- No estás cómodo con programación
- Quieres mantener el workflow visual y fácil de entender

## Conceptos Básicos

### Estructura del Nodo Code

```javascript
// Aquí escribes tu código JavaScript
// Tienes acceso a los datos de entrada
// Debes retornar los datos de salida

// Ejemplo básico
return [
  {
    json: {
      mensaje: "¡Hola mundo desde el nodo Code!"
    }
  }
];
```

### Variables Disponibles

#### `items` - Datos de Entrada
```javascript
// items es un array con todos los datos que llegan al nodo
console.log(items.length); // Cuántos items hay
console.log(items[0].json); // Datos del primer item
```

#### `$items` - Alias para items
```javascript
// $items es lo mismo que items
const primerItem = $items[0].json;
```

#### Global Functions
```javascript
// Funciones disponibles globalmente
console.log("Para debugging");
Math.random(); // Números aleatorios
Date.now(); // Timestamp actual
JSON.parse(); // Convertir string a objeto
JSON.stringify(); // Convertir objeto a string
```

## Archivos de Aprendizaje

En esta carpeta encontrarás:

1. **[01_Sintaxis_Basica.js](./01_Sintaxis_Basica.js)** - Fundamentos del código
2. **[02_Manipulacion_de_Items.js](./02_Manipulacion_de_Items.js)** - Trabajar con múltiples items
3. **[03_Uso_de_Librerias_Externas.md](./03_Uso_de_Librerias_Externas.md)** - Importar librerías
4. **[04_Try_Catch_para_Errores.js](./04_Try_Catch_para_Errores.js)** - Manejo de errores

## Ejemplos Rápidos

### 1. Transformar Datos Simple
```javascript
// Transformar el nombre a mayúsculas
const resultado = items.map(item => ({
  json: {
    ...item.json,
    nombre: item.json.nombre.toUpperCase()
  }
}));

return resultado;
```

### 2. Filtrar Items
```javascript
// Mantener solo items con edad mayor a 18
const adultos = items.filter(item => item.json.edad > 18);

return adultos;
```

### 3. Calcular Totales
```javascript
// Sumar todos los precios
const total = items.reduce((suma, item) => suma + item.json.precio, 0);

return [{
  json: {
    total: total,
    cantidad_items: items.length
  }
}];
```

### 4. Crear Múltiples Items
```javascript
// Crear un item por cada producto
const productos = items[0].json.productos;
const nuevosItems = productos.map(producto => ({
  json: {
    nombre: producto.nombre,
    precio: producto.precio,
    categoria: producto.categoria
  }
}));

return nuevosItems;
```

## Patrones Comunes

### 1. Procesamiento Item por Item
```javascript
const resultado = items.map(item => {
  const datos = item.json;
  
  // Procesar cada item individualmente
  const procesado = {
    // Tu lógica aquí
  };
  
  return { json: procesado };
});

return resultado;
```

### 2. Combinar Todos los Items
```javascript
const todosLosDatos = items.map(item => item.json);

const resultado = {
  // Procesar todos los datos juntos
  resumen: "Datos procesados",
  total: todosLosDatos.length,
  datos: todosLosDatos
};

return [{ json: resultado }];
```

### 3. Generar Múltiples Salidas
```javascript
const salidas = [];

items.forEach(item => {
  // Generar múltiples items de salida por cada item de entrada
  salidas.push({
    json: { tipo: "procesado", data: item.json }
  });
  
  salidas.push({
    json: { tipo: "log", mensaje: `Procesado: ${item.json.id}` }
  });
});

return salidas;
```

## Consejos y Mejores Prácticas

### 1. Debugging
```javascript
// Usar console.log para debugging
console.log("Items recibidos:", items.length);
console.log("Primer item:", items[0].json);

// Los logs aparecen en la consola del navegador
```

### 2. Validación de Datos
```javascript
// Siempre validar que los datos existan
if (!items || items.length === 0) {
  return [{
    json: { error: "No se recibieron datos" }
  }];
}

// Validar propiedades requeridas
const item = items[0];
if (!item.json.email) {
  throw new Error("El campo email es requerido");
}
```

### 3. Manejo de Errores
```javascript
try {
  // Tu código aquí
  const resultado = procesarDatos(items);
  return resultado;
} catch (error) {
  console.error("Error en el procesamiento:", error);
  return [{
    json: {
      error: true,
      mensaje: error.message
    }
  }];
}
```

### 4. Código Reutilizable
```javascript
// Crear funciones reutilizables
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES');
}

// Usar las funciones
const resultado = items.map(item => ({
  json: {
    email: item.json.email,
    emailValido: validarEmail(item.json.email),
    fechaFormateada: formatearFecha(item.json.fecha)
  }
}));

return resultado;
```

## Casos de Uso Populares

### 1. Procesamiento de CSV
```javascript
// Convertir CSV a objetos JSON
const csvData = items[0].json.csvContent;
const lines = csvData.split('\n');
const headers = lines[0].split(',');

const resultado = lines.slice(1).map(line => {
  const values = line.split(',');
  const obj = {};
  headers.forEach((header, index) => {
    obj[header.trim()] = values[index]?.trim();
  });
  return { json: obj };
});

return resultado;
```

### 2. Llamadas a APIs Personalizadas
```javascript
// Hacer peticiones HTTP personalizadas
const responses = [];

for (const item of items) {
  const response = await fetch(`https://api.ejemplo.com/users/${item.json.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${item.json.token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  responses.push({ json: data });
}

return responses;
```

### 3. Generación de Reportes
```javascript
// Crear un reporte completo
const datos = items.map(item => item.json);

const reporte = {
  fecha: new Date().toISOString(),
  total_registros: datos.length,
  estadisticas: {
    edad_promedio: datos.reduce((sum, item) => sum + item.edad, 0) / datos.length,
    ciudades_unicas: [...new Set(datos.map(item => item.ciudad))],
    precio_total: datos.reduce((sum, item) => sum + (item.precio || 0), 0)
  },
  datos_detallados: datos
};

return [{ json: reporte }];
```

## Limitaciones y Consideraciones

### ⚠️ Limitaciones
- **Timeout:** El código no puede ejecutarse por más de 2 minutos
- **Memoria:** Limitada según tu plan de n8n
- **Librerías:** Solo algunas librerías están disponibles
- **Asíncrono:** Cuidado con código asíncrono complejo

### 🔒 Seguridad
- **No hardcodear secretos:** Usa variables de entorno
- **Validar inputs:** Siempre valida datos de entrada
- **Sanitizar datos:** Limpia datos antes de procesarlos

### 🚀 Rendimiento
- **Evita loops infinitos:** Siempre ten condiciones de salida
- **Procesa en lotes:** Para grandes volúmenes de datos
- **Usa índices:** Para búsquedas en arrays grandes

## Próximos Pasos

1. Practica con los [ejemplos básicos](./01_Sintaxis_Basica.js)
2. Aprende sobre [manipulación de items](./02_Manipulacion_de_Items.js)
3. Explora [librerías externas](./03_Uso_de_Librerias_Externas.md)
4. Domina el [manejo de errores](./04_Try_Catch_para_Errores.js)

---

**Recuerda:** El nodo Code es una herramienta versátil y poderosa. Con práctica y experiencia, descubrirás múltiples funcionalidades que multiplicarán tu capacidad de automatización y procesamiento de datos.
