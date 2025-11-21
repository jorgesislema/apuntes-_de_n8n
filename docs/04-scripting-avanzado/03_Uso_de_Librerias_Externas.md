# Uso de Librerías Externas en el Nodo Code

## ¿Qué son las Librerías Externas?

Las librerías externas son **módulos de código especializados** que otros programadores han creado para resolver problemas específicos. Estas herramientas ya probadas y confiables te permiten implementar funcionalidades complejas sin tener que desarrollarlas desde cero.

### Concepto Técnico
El uso de librerías externas permite:
- **Reutilización de código**: Aprovechar soluciones ya desarrolladas y probadas
- **Eficiencia de desarrollo**: Reducir tiempo de implementación
- **Especialización**: Usar herramientas optimizadas para tareas específicas

## Librerías Disponibles por Defecto en n8n

n8n incluye varias librerías útiles que puedes usar directamente:

### 1. **Moment.js** - Para fechas y tiempo
```javascript
// Formatear fechas
const fecha = moment().format('YYYY-MM-DD HH:mm:ss');

// Operaciones con fechas
const mañana = moment().add(1, 'day');
const hace7dias = moment().subtract(7, 'days');

// Comparar fechas
const esHoy = moment(fecha).isSame(moment(), 'day');
```

### 2. **Lodash** - Utilidades para arrays y objetos
```javascript
// Funciones útiles con arrays
const numeros = [1, 2, 3, 4, 5];
const duplicados = _.chunk(numeros, 2); // [[1,2], [3,4], [5]]

// Trabajar con objetos
const usuario = { nombre: 'Ana', edad: 25 };
const copia = _.cloneDeep(usuario);
```

### 3. **Axios** - Para peticiones HTTP
```javascript
// Hacer peticiones HTTP
const respuesta = await axios.get('https://api.ejemplo.com/datos');
const datos = respuesta.data;
```

## Cómo Usar Librerías en el Nodo Code

### Ejemplo Práctico: Procesamiento de Fechas

```javascript
// Procesar items con fechas usando Moment.js
const itemsProcesados = items.map(item => {
    const fechaOriginal = item.json.fecha;
    
    return {
        json: {
            ...item.json,
            // Formatear fecha
            fechaFormateada: moment(fechaOriginal).format('DD/MM/YYYY'),
            
            // Calcular diferencias
            diasDesdeHoy: moment().diff(moment(fechaOriginal), 'days'),
            
            // Información adicional
            esFuturo: moment(fechaOriginal).isAfter(moment()),
            diaDeLaSemana: moment(fechaOriginal).format('dddd'),
            
            // Validaciones
            fechaValida: moment(fechaOriginal).isValid()
        }
    };
});

return itemsProcesados;
```

### Ejemplo Práctico: Manipulación de Datos con Lodash

```javascript
// Usar Lodash para operaciones complejas
const datosProcesados = items.map(item => {
    const datos = item.json;
    
    return {
        json: {
            // Limpiar objeto (remover valores null/undefined)
            datosLimpios: _.omitBy(datos, _.isNil),
            
            // Agrupar arrays
            productosAgrupados: _.groupBy(datos.productos, 'categoria'),
            
            // Encontrar valores únicos
            categoriasUnicas: _.uniq(datos.productos.map(p => p.categoria)),
            
            // Operaciones numéricas
            precioPromedio: _.mean(datos.productos.map(p => p.precio)),
            precioTotal: _.sum(datos.productos.map(p => p.precio)),
            
            // Validaciones
            tieneDatos: !_.isEmpty(datos)
        }
    };
});

return datosProcesados;
```

## 🌐 Hacer Peticiones HTTP con Axios

### Ejemplo Básico
```javascript
// Enriquecer datos con información externa
const itemsEnriquecidos = [];

for (const item of items) {
    try {
        // Obtener información adicional de una API
        const respuesta = await axios.get(`https://api.ejemplo.com/usuarios/${item.json.id}`);
        
        itemsEnriquecidos.push({
            json: {
                ...item.json,
                informacionExtra: respuesta.data,
                actualizado: true
            }
        });
    } catch (error) {
        // Manejar errores
        itemsEnriquecidos.push({
            json: {
                ...item.json,
                error: `No se pudo obtener información: ${error.message}`,
                actualizado: false
            }
        });
    }
}

return itemsEnriquecidos;
```

### Ejemplo Avanzado con Múltiples APIs
```javascript
// Combinar datos de múltiples fuentes
const procesarConMultiplesAPIs = async (items) => {
    const resultados = [];
    
    for (const item of items) {
        const usuario = item.json;
        
        try {
            // Obtener datos de perfil
            const perfil = await axios.get(`https://api.perfiles.com/user/${usuario.id}`);
            
            // Obtener datos de actividad
            const actividad = await axios.get(`https://api.actividad.com/user/${usuario.id}/recent`);
            
            // Obtener datos de configuración
            const config = await axios.get(`https://api.config.com/user/${usuario.id}/preferences`);
            
            resultados.push({
                json: {
                    ...usuario,
                    perfil: perfil.data,
                    actividadReciente: actividad.data,
                    preferencias: config.data,
                    procesadoEn: new Date().toISOString()
                }
            });
            
        } catch (error) {
            resultados.push({
                json: {
                    ...usuario,
                    error: error.message,
                    procesadoEn: new Date().toISOString()
                }
            });
        }
    }
    
    return resultados;
};

return await procesarConMultiplesAPIs(items);
```

## 🧮 Procesamiento de Datos con Funciones Matemáticas

```javascript
// Análisis estadístico básico
const analizarDatos = (items) => {
    const valores = items.map(item => item.json.valor).filter(v => typeof v === 'number');
    
    return [{
        json: {
            totalItems: items.length,
            valoresNumericos: valores.length,
            
            // Estadísticas básicas
            suma: _.sum(valores),
            promedio: _.mean(valores),
            mediana: valores.sort((a, b) => a - b)[Math.floor(valores.length / 2)],
            minimo: Math.min(...valores),
            maximo: Math.max(...valores),
            
            // Distribución
            distribucion: _.countBy(valores, v => {
                if (v < 10) return 'Bajo';
                if (v < 50) return 'Medio';
                return 'Alto';
            }),
            
            // Información adicional
            analisisRealizado: moment().format('YYYY-MM-DD HH:mm:ss')
        }
    }];
};

return analizarDatos(items);
```

## 🎨 Formateo y Validación de Datos

```javascript
// Validar y formatear datos de contacto
const validarContactos = (items) => {
    return items.map(item => {
        const contacto = item.json;
        
        return {
            json: {
                ...contacto,
                
                // Validar email
                emailValido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto.email),
                
                // Formatear teléfono
                telefonoFormateado: contacto.telefono ? 
                    contacto.telefono.replace(/\D/g, '') : null,
                
                // Validar edad
                edadValida: _.isNumber(contacto.edad) && contacto.edad > 0 && contacto.edad < 120,
                
                // Formatear nombre
                nombreFormateado: _.startCase(_.toLower(contacto.nombre)),
                
                // Generar ID único
                idUnico: `${contacto.nombre?.toLowerCase().replace(/\s+/g, '')}_${Date.now()}`,
                
                // Metadata
                validado: true,
                fechaValidacion: moment().toISOString()
            }
        };
    });
};

return validarContactos(items);
```

## Ejemplo Completo: Sistema de Procesamiento

```javascript
// Sistema completo de procesamiento de órdenes
const procesarOrdenes = async (items) => {
    const ordenesProcesadas = [];
    
    for (const item of items) {
        const orden = item.json;
        
        try {
            // 1. Validar datos básicos
            if (!orden.id || !orden.cliente || !orden.productos) {
                throw new Error('Datos incompletos en la orden');
            }
            
            // 2. Enriquecer con datos del cliente
            const cliente = await axios.get(`https://api.clientes.com/${orden.cliente}`);
            
            // 3. Calcular totales
            const subtotal = _.sum(orden.productos.map(p => p.precio * p.cantidad));
            const descuento = cliente.data.tipoCliente === 'VIP' ? subtotal * 0.1 : 0;
            const impuestos = (subtotal - descuento) * 0.21;
            const total = subtotal - descuento + impuestos;
            
            // 4. Generar factura
            const factura = {
                numero: `FAC-${orden.id}-${moment().format('YYYYMMDD')}`,
                fecha: moment().format('YYYY-MM-DD'),
                vencimiento: moment().add(30, 'days').format('YYYY-MM-DD')
            };
            
            // 5. Crear item procesado
            ordenesProcesadas.push({
                json: {
                    ...orden,
                    cliente: cliente.data,
                    factura: factura,
                    totales: {
                        subtotal: _.round(subtotal, 2),
                        descuento: _.round(descuento, 2),
                        impuestos: _.round(impuestos, 2),
                        total: _.round(total, 2)
                    },
                    estado: 'procesada',
                    procesadoEn: moment().toISOString()
                }
            });
            
        } catch (error) {
            // Manejar errores
            ordenesProcesadas.push({
                json: {
                    ...orden,
                    estado: 'error',
                    error: error.message,
                    procesadoEn: moment().toISOString()
                }
            });
        }
    }
    
    return ordenesProcesadas;
};

return await procesarOrdenes(items);
```

## 📋 Librerías Disponibles por Defecto

### Lista Completa de Librerías Incluidas:
- **moment** - Manipulación de fechas
- **lodash** - Utilidades para programación
- **axios** - Cliente HTTP
- **crypto** - Funciones criptográficas
- **uuid** - Generación de IDs únicos
- **cheerio** - Manipulación de HTML (como jQuery)
- **xml2js** - Conversión XML a JSON

### Ejemplo con UUID:
```javascript
const { v4: uuidv4 } = require('uuid');

const itemsConID = items.map(item => ({
    json: {
        ...item.json,
        id: uuidv4(),
        procesadoEn: new Date().toISOString()
    }
}));

return itemsConID;
```

## Consejos y Mejores Prácticas

### ✅ Hacer:
- Usar try/catch para manejar errores
- Validar datos antes de procesarlos
- Documentar el código con comentarios
- Usar funciones asíncronas cuando sea necesario

### ❌ Evitar:
- Hacer demasiadas peticiones HTTP simultáneas
- No manejar errores de conexión
- Modificar el array original de items
- Usar librerías que no están disponibles

## Ejemplo de Debugging

```javascript
// Útil para debugging
console.log('Iniciando procesamiento...');
console.log('Items recibidos:', items.length);

items.forEach((item, index) => {
    console.log(`Item ${index}:`, JSON.stringify(item.json, null, 2));
});

// Tu código aquí...

console.log('Procesamiento completado');
```

---

**Recuerda:** Las librerías externas son herramientas muy útiles, pero siempre verifica que estén disponibles en n8n antes de usarlas. La documentación oficial tiene la lista completa de librerías incluidas.
