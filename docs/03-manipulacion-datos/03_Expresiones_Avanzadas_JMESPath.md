# Expresiones Avanzadas con JMESPath

## ¿Qué es JMESPath?

**JMESPath** es un lenguaje de consulta para JSON que permite extraer y transformar datos de estructuras JSON complejas de manera eficiente y expresiva.

### Concepto Técnico
JMESPath funciona como un sistema de consultas especializado que permite:
- **Filtrar datos específicos** → `cars[?color=='red']`
- **Seleccionar elementos por posición** → `books[0]`
- **Aplicar funciones de agregación** → `length(candy)`

## Sintaxis Básica de JMESPath

### Seleccionar Propiedades
```javascript
// Datos de ejemplo
{
  "usuario": {
    "nombre": "Ana",
    "edad": 25,
    "hobbies": ["leer", "nadar", "cocinar"]
  }
}

// Expresiones JMESPath
usuario.nombre          // "Ana"
usuario.edad            // 25
usuario.hobbies[0]      // "leer"
usuario.hobbies[-1]     // "cocinar" (último elemento)
```

### Filtrado de Arrays
```javascript
// Datos de ejemplo
{
  "productos": [
    {"nombre": "Laptop", "precio": 1000, "categoria": "tecnologia"},
    {"nombre": "Libro", "precio": 20, "categoria": "educacion"},
    {"nombre": "Mouse", "precio": 30, "categoria": "tecnologia"}
  ]
}

// Expresiones de filtrado
productos[?precio > `50`]                    // Productos caros
productos[?categoria == 'tecnologia']       // Solo tecnología
productos[?precio < `100`].nombre           // Nombres de productos baratos
```

## Expresiones Avanzadas

### 1. Proyecciones y Transformaciones
```javascript
// Extraer solo nombres y precios
productos[].{nombre: nombre, precio: precio}

// Crear estructura nueva
productos[].{
  articulo: nombre,
  costo: precio,
  esBarato: precio < `100`
}
```

### 2. Funciones Built-in
```javascript
// Funciones de array
length(productos)                    // Cantidad de productos
max(productos[].precio)             // Precio máximo
min(productos[].precio)             // Precio mínimo
sum(productos[].precio)             // Suma total
avg(productos[].precio)             // Promedio

// Funciones de string
starts_with(nombre, 'L')            // Empieza con 'L'
ends_with(nombre, 'top')            // Termina con 'top'
contains(nombre, 'apt')             // Contiene 'apt'
```

### 3. Expresiones Condicionales
```javascript
// Operador ternario
productos[].{
  nombre: nombre,
  estado: precio > `500` && 'caro' || 'barato'
}

// Múltiples condiciones
productos[?precio > `100` && categoria == 'tecnologia']
```

## Casos de Uso Reales en n8n

### 1. Procesamiento de APIs
```javascript
// Respuesta de API de usuarios
{
  "users": [
    {"id": 1, "name": "Juan", "active": true, "role": "admin"},
    {"id": 2, "name": "María", "active": false, "role": "user"},
    {"id": 3, "name": "Pedro", "active": true, "role": "user"}
  ]
}

// Obtener solo usuarios activos con sus roles
{{ $json.users[?active == `true`].{id: id, name: name, role: role} }}
```

### 2. Transformación de Datos de E-commerce
```javascript
// Datos de órdenes
{
  "orders": [
    {
      "id": "001",
      "customer": "Ana García",
      "items": [
        {"product": "Laptop", "quantity": 1, "price": 1000},
        {"product": "Mouse", "quantity": 2, "price": 25}
      ],
      "status": "completed"
    }
  ]
}

// Calcular total por orden
{{ $json.orders[].{
  orderId: id,
  customer: customer,
  total: sum(items[].(@.quantity * @.price)),
  itemCount: sum(items[].quantity)
} }}
```

### 3. Manejo de Datos Anidados
```javascript
// Estructura compleja
{
  "company": {
    "departments": [
      {
        "name": "IT",
        "employees": [
          {"name": "Carlos", "salary": 5000, "skills": ["Python", "JavaScript"]},
          {"name": "Laura", "salary": 4500, "skills": ["Java", "SQL"]}
        ]
      }
    ]
  }
}

// Obtener empleados con salario alto
{{ $json.company.departments[].employees[?salary > `4800`] }}

// Listar todas las habilidades únicas
{{ $json.company.departments[].employees[].skills[] | unique(@) }}
```

## 🛠️ Técnicas Avanzadas

### 1. Pipe Expressions
```javascript
// Encadenar operaciones
productos[] | [?precio > `100`] | [0].nombre    // Primer producto caro
usuarios[] | [?active] | length(@)             // Cantidad de usuarios activos
```

### 2. Multi-Hash Selections
```javascript
// Seleccionar múltiples campos
productos[].{
  info: {nombre: nombre, precio: precio},
  metadata: {categoria: categoria, disponible: stock > `0`}
}
```

### 3. Flatten Operations
```javascript
// Aplanar arrays anidados
departments[].employees[].skills[]              // Todas las habilidades
departments[].employees[] | [].name             // Todos los nombres
```

## Ejemplos Prácticos en n8n

### Ejemplo 1: Filtrar Notificaciones
```javascript
// En un nodo Set, filtrar notificaciones importantes
{
  "notificaciones_importantes": "{{ $json.notifications[?priority == 'high' && read == `false`] }}"
}
```

### Ejemplo 2: Transformar Datos de CRM
```javascript
// Preparar datos para envío a otro sistema
{
  "contactos_procesados": "{{ $json.contacts[].{
    id: id,
    nombre_completo: concat([first_name, ' ', last_name]),
    email: email,
    etiquetas: tags[].name,
    ultima_actividad: last_activity_date
  } }}"
}
```

### Ejemplo 3: Agregaciones Complejas
```javascript
// Calcular estadísticas de ventas
{
  "reporte_ventas": {
    "total_ventas": "{{ sum($json.orders[].total) }}",
    "promedio_orden": "{{ avg($json.orders[].total) }}",
    "ordenes_grandes": "{{ length($json.orders[?total > `500`]) }}",
    "top_productos": "{{ $json.orders[].items[].product | unique(@) | [0:5] }}"
  }
}
```

## 🚨 Consejos y Buenas Prácticas

### ✅ Hacer
- Usar backticks para valores literales: `'texto'`, `123`, `true`
- Probar expresiones paso a paso
- Usar el operador `@` para referencia actual
- Combinar con funciones de n8n cuando sea necesario

### ❌ Evitar
- Expresiones demasiado complejas en una línea
- Olvidar el escape de comillas
- No validar que los datos existan antes de acceder

## Depuración de Expresiones

### Técnicas de Debug
```javascript
// Verificar estructura de datos
{{ $json | keys(@) }}                          // Listar todas las claves
{{ $json.array | length(@) }}                  // Verificar longitud
{{ $json.objeto | type(@) }}                   // Verificar tipo de dato
```

### Validaciones
```javascript
// Verificar antes de acceder
{{ $json.usuarios && length($json.usuarios) > 0 && $json.usuarios[0].nombre }}
```

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Filtrado Básico
Dada una lista de productos, filtra solo los que están en stock y cuestan menos de $100.

### Ejercicio 2: Transformación
Convierte una lista de usuarios en un formato específico para envío por email.

### Ejercicio 3: Agregación
Calcula estadísticas de un conjunto de órdenes de compra.

## 📖 Recursos Adicionales

- [JMESPath Tutorial Oficial](https://jmespath.org/tutorial.html)
- [JMESPath Playground](https://jmespath.org/) - Para probar expresiones
- [n8n Expression Reference](https://docs.n8n.io/expressions/)

---

**Recuerda:** JMESPath es una herramienta poderosa para manejar datos JSON. Con práctica, podrás extraer y transformar cualquier información que necesites de manera eficiente y elegante.
