// Manipulación de Items en el Nodo Code

// Conceptos Básicos
// Los 'items' en n8n son objetos de datos que fluyen a través del workflow
// Cada item tiene una estructura: { json: {...}, binary: {...} }
// - json: contiene los datos principales del item
// - binary: contiene archivos adjuntos (imágenes, documentos, etc.)

// =====================================
// 1. ACCEDER A DATOS DE ITEMS
// =====================================

// Acceder al primer item
const primerItem = items[0];
console.log('Primer item:', primerItem.json);

// Acceder a datos específicos
const nombre = items[0].json.nombre;
const edad = items[0].json.edad;

// Forma segura de acceder (evita errores)
const nombreSeguro = items[0]?.json?.nombre || 'Sin nombre';

// =====================================
// 2. MODIFICAR ITEMS EXISTENTES
// =====================================

// Modificar un campo específico
items[0].json.nombre = 'Nuevo Nombre';

// Añadir nuevos campos
items[0].json.procesado = true;
items[0].json.fechaProceso = new Date().toISOString();

// Modificar múltiples campos
Object.assign(items[0].json, {
    estado: 'actualizado',
    version: '2.0',
    modificadoPor: 'n8n'
});

// =====================================
// 3. CREAR NUEVOS ITEMS
// =====================================

// Crear un item simple
const nuevoItem = {
    json: {
        id: 1,
        mensaje: 'Hola mundo',
        fecha: new Date().toISOString()
    }
};

// Crear múltiples items
const nuevosItems = [
    { json: { id: 1, nombre: 'Ana', edad: 25 } },
    { json: { id: 2, nombre: 'Carlos', edad: 30 } },
    { json: { id: 3, nombre: 'María', edad: 28 } }
];

// =====================================
// 4. TRANSFORMAR TODOS LOS ITEMS
// =====================================

// Transformar cada item (como un map)
const itemsTransformados = items.map(item => ({
    json: {
        ...item.json,
        nombreCompleto: `${item.json.nombre} ${item.json.apellido}`,
        esAdulto: item.json.edad >= 18,
        categoriaEdad: item.json.edad < 18 ? 'Menor' : 
                      item.json.edad < 65 ? 'Adulto' : 'Senior'
    }
}));

// =====================================
// 5. FILTRAR ITEMS
// =====================================

// Filtrar items que cumplan condiciones
const itemsFiltrados = items.filter(item => {
    return item.json.activo === true && item.json.edad > 21;
});

// Filtrar con lógica compleja
const itemsComplejos = items.filter(item => {
    const json = item.json;
    return json.departamento === 'IT' && 
           json.salario > 50000 && 
           json.experiencia >= 2;
});

// =====================================
// 6. AGRUPAR Y ORGANIZAR ITEMS
// =====================================

// Agrupar por departamento
const porDepartamento = {};
items.forEach(item => {
    const dept = item.json.departamento;
    if (!porDepartamento[dept]) {
        porDepartamento[dept] = [];
    }
    porDepartamento[dept].push(item);
});

// Convertir agrupación en items
const itemsAgrupados = Object.entries(porDepartamento).map(([dept, empleados]) => ({
    json: {
        departamento: dept,
        empleados: empleados.map(emp => emp.json),
        total: empleados.length
    }
}));

// =====================================
// 7. ORDENAR ITEMS
// =====================================

// Ordenar por edad (ascendente)
const itemsOrdenados = items.sort((a, b) => a.json.edad - b.json.edad);

// Ordenar por nombre (alfabético)
const itemsPorNombre = items.sort((a, b) => 
    a.json.nombre.localeCompare(b.json.nombre)
);

// Ordenar por fecha (más reciente primero)
const itemsPorFecha = items.sort((a, b) => 
    new Date(b.json.fecha) - new Date(a.json.fecha)
);

// =====================================
// 8. COMBINAR ITEMS
// =====================================

// Combinar datos de múltiples items en uno
const itemCombinado = {
    json: {
        resumen: {
            totalItems: items.length,
            nombres: items.map(item => item.json.nombre),
            edadPromedio: items.reduce((sum, item) => sum + item.json.edad, 0) / items.length,
            fechaProceso: new Date().toISOString()
        }
    }
};

// =====================================
// 9. DIVIDIR ITEMS
// =====================================

// Dividir un item en múltiples
const itemConArray = items[0];
const itemsDivididos = itemConArray.json.productos.map(producto => ({
    json: {
        ...itemConArray.json,
        producto: producto,
        productos: undefined // Remover el array original
    }
}));

// =====================================
// 10. VALIDAR Y LIMPIAR DATOS
// =====================================

// Validar y limpiar items
const itemsLimpios = items.map(item => {
    const json = item.json;
    
    return {
        json: {
            // Limpiar strings
            nombre: json.nombre?.trim() || '',
            email: json.email?.toLowerCase().trim() || '',
            
            // Validar números
            edad: typeof json.edad === 'number' && json.edad > 0 ? json.edad : 0,
            
            // Validar booleanos
            activo: Boolean(json.activo),
            
            // Limpiar fechas
            fechaRegistro: json.fechaRegistro ? new Date(json.fechaRegistro).toISOString() : null,
            
            // Valores por defecto
            departamento: json.departamento || 'Sin asignar',
            salario: json.salario || 0
        }
    };
});

// =====================================
// 11. TRABAJAR CON DATOS BINARIOS
// =====================================

// Acceder a datos binarios (archivos)
if (items[0].binary) {
    const archivo = items[0].binary.data;
    console.log('Tipo de archivo:', archivo.mimeType);
    console.log('Nombre del archivo:', archivo.fileName);
}

// Crear item con datos binarios
const itemConBinario = {
    json: {
        nombreArchivo: 'documento.pdf',
        tamaño: 1024,
        procesado: true
    },
    binary: {
        data: items[0].binary?.data // Copiar binario existente
    }
};

// =====================================
// 12. MANEJO DE ERRORES
// =====================================

// Procesar items con manejo de errores
const itemsProcesados = items.map(item => {
    try {
        // Intentar procesar
        const resultado = {
            json: {
                ...item.json,
                procesado: true,
                resultado: item.json.valor * 2
            }
        };
        return resultado;
    } catch (error) {
        // En caso de error, devolver item con información del error
        return {
            json: {
                ...item.json,
                procesado: false,
                error: error.message,
                fechaError: new Date().toISOString()
            }
        };
    }
});

// =====================================
// 13. EJEMPLO COMPLETO: PROCESAMIENTO DE USUARIOS
// =====================================

// Ejemplo real: procesar lista de usuarios
const procesarUsuarios = (items) => {
    return items
        .filter(item => item.json.activo) // Solo usuarios activos
        .map(item => {
            const usuario = item.json;
            
            return {
                json: {
                    id: usuario.id,
                    nombre: usuario.nombre?.trim(),
                    email: usuario.email?.toLowerCase(),
                    
                    // Calcular edad a partir de fecha de nacimiento
                    edad: usuario.fechaNacimiento ? 
                        Math.floor((new Date() - new Date(usuario.fechaNacimiento)) / (365.25 * 24 * 60 * 60 * 1000)) : 
                        null,
                    
                    // Generar datos adicionales
                    iniciales: usuario.nombre?.split(' ').map(n => n[0]).join(''),
                    esAdulto: usuario.edad >= 18,
                    antiguedad: usuario.fechaIngreso ? 
                        Math.floor((new Date() - new Date(usuario.fechaIngreso)) / (365.25 * 24 * 60 * 60 * 1000)) : 
                        0,
                    
                    // Clasificaciones
                    categoria: usuario.edad < 25 ? 'Joven' : 
                              usuario.edad < 40 ? 'Adulto Joven' : 
                              usuario.edad < 60 ? 'Adulto' : 'Senior',
                    
                    // Metadata de procesamiento
                    procesadoEn: new Date().toISOString(),
                    version: '1.0'
                }
            };
        })
        .sort((a, b) => a.json.nombre.localeCompare(b.json.nombre)); // Ordenar por nombre
};

// =====================================
// RETORNO FINAL
// =====================================

// Ejemplo de retorno simple
return items.map(item => ({
    json: {
        ...item.json,
        procesado: true,
        timestamp: new Date().toISOString()
    }
}));

// CONSEJOS IMPORTANTES:
// 1. Siempre retorna un array de items
// 2. Cada item debe tener la estructura { json: {...} }
// 3. Usa try/catch para manejar errores
// 4. Valida los datos antes de procesarlos
// 5. Documenta tu código para futuros mantenimientos
