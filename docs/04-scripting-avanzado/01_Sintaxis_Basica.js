// 01_Sintaxis_Basica.js - Fundamentos del Nodo Code

// ================================
// ESTRUCTURA BÁSICA
// ================================

// Todo código en n8n debe retornar un array de items
// Cada item debe tener un objeto 'json' con los datos
return [
  {
    json: {
      mensaje: "¡Hola mundo!"
    }
  }
];

// ================================
// ACCESO A DATOS DE ENTRADA
// ================================

// La variable 'items' contiene todos los datos que llegan al nodo
console.log("Cantidad de items:", items.length);
console.log("Primer item:", items[0].json);

// Ejemplo: Acceder a datos del primer item
const primerItem = items[0].json;
const nombre = primerItem.nombre;
const edad = primerItem.edad;

console.log(`Hola ${nombre}, tienes ${edad} años`);

// ================================
// PROCESAMIENTO BÁSICO
// ================================

// Ejemplo 1: Transformar datos simples
const itemTransformado = {
  json: {
    nombre_completo: items[0].json.nombre + " " + items[0].json.apellido,
    edad_en_meses: items[0].json.edad * 12,
    fecha_actual: new Date().toISOString()
  }
};

return [itemTransformado];

// ================================
// TRABAJAR CON MÚLTIPLES ITEMS
// ================================

// Ejemplo 2: Procesar cada item individualmente
const itemsProcesados = items.map(item => {
  const datos = item.json;
  
  return {
    json: {
      id: datos.id,
      nombre: datos.nombre.toUpperCase(),
      email: datos.email.toLowerCase(),
      es_adulto: datos.edad >= 18
    }
  };
});

return itemsProcesados;

// ================================
// OPERACIONES MATEMÁTICAS
// ================================

// Ejemplo 3: Cálculos con los datos
const itemConCalculos = items.map(item => {
  const datos = item.json;
  
  return {
    json: {
      precio_original: datos.precio,
      descuento: datos.precio * 0.10, // 10% de descuento
      precio_final: datos.precio * 0.90,
      iva: datos.precio * 0.90 * 0.21, // 21% IVA sobre precio con descuento
      total: datos.precio * 0.90 * 1.21 // Precio final con IVA
    }
  };
});

return itemConCalculos;

// ================================
// TRABAJAR CON STRINGS (TEXTO)
// ================================

// Ejemplo 4: Manipulación de texto
const itemsTexto = items.map(item => {
  const datos = item.json;
  
  return {
    json: {
      nombre_original: datos.nombre,
      nombre_mayusculas: datos.nombre.toUpperCase(),
      nombre_minusculas: datos.nombre.toLowerCase(),
      iniciales: datos.nombre.split(' ').map(n => n[0]).join('.'),
      longitud_nombre: datos.nombre.length,
      primera_letra: datos.nombre.charAt(0),
      contiene_juan: datos.nombre.includes('Juan')
    }
  };
});

return itemsTexto;

// ================================
// TRABAJAR CON FECHAS
// ================================

// Ejemplo 5: Manipulación de fechas
const itemsConFechas = items.map(item => {
  const datos = item.json;
  const fechaNacimiento = new Date(datos.fecha_nacimiento);
  const hoy = new Date();
  
  return {
    json: {
      fecha_nacimiento: datos.fecha_nacimiento,
      fecha_formateada: fechaNacimiento.toLocaleDateString('es-ES'),
      año_nacimiento: fechaNacimiento.getFullYear(),
      mes_nacimiento: fechaNacimiento.getMonth() + 1,
      edad_exacta: Math.floor((hoy - fechaNacimiento) / (365.25 * 24 * 60 * 60 * 1000)),
      es_cumpleaños: fechaNacimiento.getMonth() === hoy.getMonth() && fechaNacimiento.getDate() === hoy.getDate()
    }
  };
});

return itemsConFechas;

// ================================
// TRABAJAR CON ARRAYS (LISTAS)
// ================================

// Ejemplo 6: Manipulación de arrays
const itemsConArrays = items.map(item => {
  const datos = item.json;
  const intereses = datos.intereses || []; // Si no existe, usar array vacío
  
  return {
    json: {
      intereses_originales: intereses,
      cantidad_intereses: intereses.length,
      primer_interes: intereses[0] || "Sin intereses",
      ultimo_interes: intereses[intereses.length - 1] || "Sin intereses",
      intereses_texto: intereses.join(', '),
      tiene_deportes: intereses.includes('deportes'),
      intereses_mayusculas: intereses.map(interes => interes.toUpperCase())
    }
  };
});

return itemsConArrays;

// ================================
// CONDICIONALES (IF/ELSE)
// ================================

// Ejemplo 7: Lógica condicional
const itemsConLogica = items.map(item => {
  const datos = item.json;
  let categoria;
  let descuento;
  
  // Determinar categoría por edad
  if (datos.edad < 18) {
    categoria = "Menor";
    descuento = 0.05; // 5% descuento para menores
  } else if (datos.edad < 65) {
    categoria = "Adulto";
    descuento = 0.10; // 10% descuento para adultos
  } else {
    categoria = "Adulto Mayor";
    descuento = 0.15; // 15% descuento para adultos mayores
  }
  
  return {
    json: {
      nombre: datos.nombre,
      edad: datos.edad,
      categoria: categoria,
      descuento_aplicado: descuento,
      precio_original: datos.precio || 100,
      precio_final: (datos.precio || 100) * (1 - descuento)
    }
  };
});

return itemsConLogica;

// ================================
// COMBINAR TODOS LOS ITEMS EN UNO
// ================================

// Ejemplo 8: Crear resumen de todos los items
const todosLosDatos = items.map(item => item.json);

const resumen = {
  json: {
    fecha_procesamiento: new Date().toISOString(),
    total_items: todosLosDatos.length,
    edad_promedio: todosLosDatos.reduce((sum, item) => sum + item.edad, 0) / todosLosDatos.length,
    precio_total: todosLosDatos.reduce((sum, item) => sum + (item.precio || 0), 0),
    nombres: todosLosDatos.map(item => item.nombre),
    estadisticas: {
      menores: todosLosDatos.filter(item => item.edad < 18).length,
      adultos: todosLosDatos.filter(item => item.edad >= 18 && item.edad < 65).length,
      adultos_mayores: todosLosDatos.filter(item => item.edad >= 65).length
    }
  }
};

return [resumen];

// ================================
// GENERAR MÚLTIPLES ITEMS
// ================================

// Ejemplo 9: Crear múltiples items de salida
const nuevosItems = [];

items.forEach(item => {
  const datos = item.json;
  
  // Crear un item para información personal
  nuevosItems.push({
    json: {
      tipo: "personal",
      nombre: datos.nombre,
      edad: datos.edad,
      email: datos.email
    }
  });
  
  // Crear un item para información comercial
  nuevosItems.push({
    json: {
      tipo: "comercial",
      cliente_id: datos.id,
      precio: datos.precio || 0,
      descuento: (datos.precio || 0) * 0.10
    }
  });
});

return nuevosItems;

// ================================
// VALIDACIÓN DE DATOS
// ================================

// Ejemplo 10: Validar y limpiar datos
const itemsValidados = items.map(item => {
  const datos = item.json;
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValido = emailRegex.test(datos.email);
  
  // Validar edad
  const edadValida = datos.edad && datos.edad > 0 && datos.edad < 150;
  
  // Limpiar nombre (quitar espacios extra)
  const nombreLimpio = datos.nombre ? datos.nombre.trim() : "";
  
  return {
    json: {
      nombre: nombreLimpio,
      email: datos.email,
      email_valido: emailValido,
      edad: datos.edad,
      edad_valida: edadValida,
      datos_completos: nombreLimpio && emailValido && edadValida,
      errores: [
        !nombreLimpio && "Nombre vacío",
        !emailValido && "Email inválido",
        !edadValida && "Edad inválida"
      ].filter(Boolean) // Quitar elementos falsy
    }
  };
});

return itemsValidados;

// ================================
// FUNCIONES ÚTILES
// ================================

// Ejemplo 11: Crear funciones reutilizables
function calcularDescuento(precio, porcentaje) {
  return precio * (porcentaje / 100);
}

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(precio);
}

function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Usar las funciones
const itemsConFunciones = items.map(item => {
  const datos = item.json;
  const precio = datos.precio || 0;
  const descuento = calcularDescuento(precio, 10);
  
  return {
    json: {
      id: generarId(),
      nombre: datos.nombre,
      precio_original: formatearPrecio(precio),
      descuento: formatearPrecio(descuento),
      precio_final: formatearPrecio(precio - descuento),
      timestamp: new Date().toISOString()
    }
  };
});

return itemsConFunciones;

// ================================
// EJEMPLO FINAL: PROCESADOR COMPLETO
// ================================

// Combina varias técnicas en un procesador completo
const procesadorCompleto = items.map((item, index) => {
  const datos = item.json;
  
  // Validaciones
  const nombre = datos.nombre ? datos.nombre.trim() : `Usuario ${index + 1}`;
  const edad = datos.edad || 0;
  const email = datos.email || "";
  
  // Cálculos
  const precio = datos.precio || 0;
  const descuentoPorEdad = edad >= 65 ? 0.15 : edad < 18 ? 0.05 : 0.10;
  const precioConDescuento = precio * (1 - descuentoPorEdad);
  
  // Información adicional
  const fechaProcesamiento = new Date();
  const esFinDeSemana = fechaProcesamiento.getDay() === 0 || fechaProcesamiento.getDay() === 6;
  
  return {
    json: {
      // Información básica
      id: `PROC-${Date.now()}-${index}`,
      nombre: nombre,
      edad: edad,
      email: email,
      
      // Información comercial
      precio_original: precio,
      descuento_aplicado: descuentoPorEdad,
      precio_final: precioConDescuento,
      
      // Metadatos
      procesado_en: fechaProcesamiento.toISOString(),
      procesado_fin_semana: esFinDeSemana,
      numero_item: index + 1,
      total_items: items.length,
      
      // Validaciones
      datos_validos: {
        nombre: nombre.length > 0,
        edad: edad > 0 && edad < 150,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        precio: precio >= 0
      }
    }
  };
});

return procesadorCompleto;
