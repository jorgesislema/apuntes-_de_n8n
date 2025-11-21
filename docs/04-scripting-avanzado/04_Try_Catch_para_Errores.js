// Try-Catch para Manejo de Errores en el Nodo Code

// ¿Qué es Try-Catch?
// Es un mecanismo de control de flujo que permite manejar errores de manera controlada
// Si algo falla en el "try", automáticamente se ejecuta el "catch"

// Ejemplo técnico:
// - TRY: Bloque donde se ejecuta código que puede generar errores
// - CATCH: Bloque que maneja los errores cuando ocurren
// - FINALLY: Bloque que se ejecuta siempre, independientemente del resultado

// =====================================
// 1. ESTRUCTURA BÁSICA DE TRY-CATCH
// =====================================

// Ejemplo básico
try {
    // Código que puede fallar
    const resultado = items[0].json.valor / items[0].json.divisor;
    console.log('Resultado:', resultado);
} catch (error) {
    // Qué hacer si algo sale mal
    console.error('Error:', error.message);
}

// =====================================
// 2. PROCESAMIENTO SEGURO DE ITEMS
// =====================================

// Procesar items con manejo de errores individual
const procesarItemsSeguro = (items) => {
    const itemsProcesados = [];
    
    items.forEach((item, index) => {
        try {
            // Intentar procesar el item
            const resultado = {
                json: {
                    ...item.json,
                    // Operaciones que pueden fallar
                    doble: item.json.numero * 2,
                    nombreMayusculas: item.json.nombre.toUpperCase(),
                    fechaFormateada: new Date(item.json.fecha).toISOString(),
                    procesado: true
                }
            };
            
            itemsProcesados.push(resultado);
            
        } catch (error) {
            // Si falla, crear un item con información del error
            itemsProcesados.push({
                json: {
                    ...item.json,
                    procesado: false,
                    error: error.message,
                    errorIndex: index,
                    fechaError: new Date().toISOString()
                }
            });
        }
    });
    
    return itemsProcesados;
};

// =====================================
// 3. MANEJO DE ERRORES ESPECÍFICOS
// =====================================

// Diferentes tipos de errores
const manejarErroresEspecificos = (items) => {
    return items.map((item, index) => {
        try {
            const datos = item.json;
            
            // Validar datos requeridos
            if (!datos.nombre) {
                throw new Error('Nombre es requerido');
            }
            
            if (!datos.email) {
                throw new Error('Email es requerido');
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(datos.email)) {
                throw new Error('Formato de email inválido');
            }
            
            // Validar edad
            if (datos.edad && (datos.edad < 0 || datos.edad > 120)) {
                throw new Error('Edad debe estar entre 0 y 120');
            }
            
            // Si todo está bien, procesar
            return {
                json: {
                    ...datos,
                    validado: true,
                    procesadoEn: new Date().toISOString()
                }
            };
            
        } catch (error) {
            return {
                json: {
                    ...item.json,
                    validado: false,
                    tipoError: error.message,
                    itemIndex: index,
                    fechaError: new Date().toISOString()
                }
            };
        }
    });
};

// =====================================
// 4. TRY-CATCH ANIDADO
// =====================================

// Múltiples operaciones con manejo específico
const procesamientoComplejo = (items) => {
    const resultados = [];
    
    items.forEach((item, index) => {
        const resultado = {
            json: {
                ...item.json,
                index: index,
                procesado: false,
                errores: []
            }
        };
        
        // Operación 1: Validar datos básicos
        try {
            if (!item.json.id) throw new Error('ID faltante');
            if (!item.json.nombre) throw new Error('Nombre faltante');
            resultado.json.validacionBasica = true;
        } catch (error) {
            resultado.json.errores.push(`Validación básica: ${error.message}`);
        }
        
        // Operación 2: Procesar números
        try {
            if (item.json.numero) {
                resultado.json.numeroDoble = item.json.numero * 2;
                resultado.json.numeroRaiz = Math.sqrt(item.json.numero);
            }
            resultado.json.calculosNumericos = true;
        } catch (error) {
            resultado.json.errores.push(`Cálculos numéricos: ${error.message}`);
        }
        
        // Operación 3: Procesar fechas
        try {
            if (item.json.fecha) {
                const fecha = new Date(item.json.fecha);
                if (isNaN(fecha.getTime())) throw new Error('Fecha inválida');
                resultado.json.fechaFormateada = fecha.toISOString();
                resultado.json.fechaTimestamp = fecha.getTime();
            }
            resultado.json.procesamientoFecha = true;
        } catch (error) {
            resultado.json.errores.push(`Procesamiento fecha: ${error.message}`);
        }
        
        // Marcar como procesado si no hay errores
        if (resultado.json.errores.length === 0) {
            resultado.json.procesado = true;
        }
        
        resultados.push(resultado);
    });
    
    return resultados;
};

// =====================================
// 5. MANEJO DE ERRORES ASÍNCRONOS
// =====================================

// Para operaciones asíncronas (APIs, bases de datos)
const procesarConAPIs = async (items) => {
    const resultados = [];
    
    for (const item of items) {
        try {
            // Simular llamada a API
            const respuesta = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simular éxito/error aleatorio
                    if (Math.random() > 0.3) {
                        resolve({ datos: 'Datos de la API', status: 'success' });
                    } else {
                        reject(new Error('Error de conexión API'));
                    }
                }, 100);
            });
            
            resultados.push({
                json: {
                    ...item.json,
                    datosAPI: respuesta.datos,
                    exito: true,
                    procesadoEn: new Date().toISOString()
                }
            });
            
        } catch (error) {
            resultados.push({
                json: {
                    ...item.json,
                    exito: false,
                    errorAPI: error.message,
                    procesadoEn: new Date().toISOString()
                }
            });
        }
    }
    
    return resultados;
};

// =====================================
// 6. FINALLY - SIEMPRE SE EJECUTA
// =====================================

// Finally se ejecuta siempre, haya error o no
const conFinally = (items) => {
    let procesados = 0;
    let errores = 0;
    
    const resultados = items.map(item => {
        try {
            // Intentar procesar
            const resultado = {
                json: {
                    ...item.json,
                    procesado: true,
                    valor: item.json.numero * 2
                }
            };
            
            return resultado;
            
        } catch (error) {
            return {
                json: {
                    ...item.json,
                    procesado: false,
                    error: error.message
                }
            };
            
        } finally {
            // Esto SIEMPRE se ejecuta
            if (item.json.procesado !== false) {
                procesados++;
            } else {
                errores++;
            }
            
            console.log(`Item procesado. Total: ${procesados}, Errores: ${errores}`);
        }
    });
    
    return resultados;
};

// =====================================
// 7. CREAR ERRORES PERSONALIZADOS
// =====================================

// Crear clases de error personalizadas
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

class BusinessError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'BusinessError';
        this.code = code;
    }
}

// Usar errores personalizados
const validarConErroresPersonalizados = (items) => {
    return items.map(item => {
        try {
            const datos = item.json;
            
            // Validaciones que lanzan errores específicos
            if (!datos.email) {
                throw new ValidationError('Email es requerido', 'email');
            }
            
            if (datos.edad < 0) {
                throw new ValidationError('Edad no puede ser negativa', 'edad');
            }
            
            if (datos.saldo < 0) {
                throw new BusinessError('Saldo insuficiente', 'SALDO_INSUFICIENTE');
            }
            
            return {
                json: {
                    ...datos,
                    validado: true
                }
            };
            
        } catch (error) {
            return {
                json: {
                    ...item.json,
                    validado: false,
                    tipoError: error.name,
                    codigoError: error.code || null,
                    campo: error.field || null,
                    mensaje: error.message
                }
            };
        }
    });
};

// =====================================
// 8. PATRÓN DE RETRY (REINTENTOS)
// =====================================

// Reintentar operaciones que fallan
const conReintentos = async (items) => {
    const resultados = [];
    
    for (const item of items) {
        let intentos = 0;
        const maxIntentos = 3;
        let exito = false;
        
        while (intentos < maxIntentos && !exito) {
            try {
                intentos++;
                
                // Simular operación que puede fallar
                const resultado = await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (Math.random() > 0.7) { // 30% de probabilidad de éxito
                            resolve({ datos: 'Procesado correctamente' });
                        } else {
                            reject(new Error('Error temporal'));
                        }
                    }, 100);
                });
                
                resultados.push({
                    json: {
                        ...item.json,
                        procesado: true,
                        intentos: intentos,
                        datos: resultado.datos
                    }
                });
                
                exito = true;
                
            } catch (error) {
                if (intentos >= maxIntentos) {
                    // Si se agotaron los intentos
                    resultados.push({
                        json: {
                            ...item.json,
                            procesado: false,
                            intentos: intentos,
                            errorFinal: error.message
                        }
                    });
                } else {
                    // Esperar un poco antes del siguiente intento
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    }
    
    return resultados;
};

// =====================================
// 9. LOGGING DE ERRORES
// =====================================

// Sistema de logging detallado
const conLogging = (items) => {
    const log = {
        inicio: new Date().toISOString(),
        totalItems: items.length,
        procesados: 0,
        errores: 0,
        detalleErrores: []
    };
    
    const resultados = items.map((item, index) => {
        try {
            // Procesar item
            const resultado = {
                json: {
                    ...item.json,
                    procesado: true,
                    timestamp: new Date().toISOString()
                }
            };
            
            log.procesados++;
            return resultado;
            
        } catch (error) {
            log.errores++;
            log.detalleErrores.push({
                index: index,
                error: error.message,
                item: item.json,
                timestamp: new Date().toISOString()
            });
            
            return {
                json: {
                    ...item.json,
                    procesado: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
            };
        }
    });
    
    // Agregar log como último item
    resultados.push({
        json: {
            ...log,
            fin: new Date().toISOString(),
            tasaExito: (log.procesados / log.totalItems) * 100
        }
    });
    
    return resultados;
};

// =====================================
// 10. EJEMPLO COMPLETO DE PRODUCCIÓN
// =====================================

// Sistema completo con manejo robusto de errores
const sistemaCompleto = async (items) => {
    const config = {
        maxReintentos: 3,
        timeoutAPI: 5000,
        validacionEstricta: true
    };
    
    const resultados = [];
    const estadisticas = {
        procesados: 0,
        errores: 0,
        reintentos: 0
    };
    
    for (const [index, item] of items.entries()) {
        let intentos = 0;
        let procesado = false;
        
        while (intentos < config.maxReintentos && !procesado) {
            try {
                intentos++;
                if (intentos > 1) estadisticas.reintentos++;
                
                // Validación estricta
                if (config.validacionEstricta) {
                    if (!item.json.id) throw new ValidationError('ID requerido', 'id');
                    if (!item.json.email) throw new ValidationError('Email requerido', 'email');
                }
                
                // Simulación de procesamiento complejo
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Simulación de llamada a API externa
                const datosExternos = await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Timeout de API'));
                    }, config.timeoutAPI);
                    
                    setTimeout(() => {
                        clearTimeout(timeout);
                        if (Math.random() > 0.2) {
                            resolve({ info: 'Datos externos', status: 'ok' });
                        } else {
                            reject(new Error('Error de API externa'));
                        }
                    }, 50);
                });
                
                // Si llegamos aquí, todo salió bien
                resultados.push({
                    json: {
                        ...item.json,
                        procesado: true,
                        intentos: intentos,
                        datosExternos: datosExternos,
                        procesadoEn: new Date().toISOString()
                    }
                });
                
                estadisticas.procesados++;
                procesado = true;
                
            } catch (error) {
                if (intentos >= config.maxReintentos) {
                    // Se agotaron los reintentos
                    resultados.push({
                        json: {
                            ...item.json,
                            procesado: false,
                            intentos: intentos,
                            tipoError: error.name || 'Error',
                            mensaje: error.message,
                            campo: error.field || null,
                            timestamp: new Date().toISOString()
                        }
                    });
                    
                    estadisticas.errores++;
                    procesado = true; // Para salir del bucle
                    
                } else {
                    // Esperar antes del siguiente intento
                    await new Promise(resolve => setTimeout(resolve, 1000 * intentos));
                }
            }
        }
    }
    
    // Agregar estadísticas finales
    resultados.push({
        json: {
            tipo: 'estadisticas',
            total: items.length,
            procesados: estadisticas.procesados,
            errores: estadisticas.errores,
            reintentos: estadisticas.reintentos,
            tasaExito: (estadisticas.procesados / items.length) * 100,
            procesadoEn: new Date().toISOString()
        }
    });
    
    return resultados;
};

// =====================================
// RETORNO - EJEMPLO DE USO
// =====================================

// Usar el sistema completo
try {
    // Procesamiento principal
    const resultado = await sistemaCompleto(items);
    return resultado;
    
} catch (error) {
    // Error crítico que afecta todo el procesamiento
    return [{
        json: {
            error: 'Error crítico del sistema',
            mensaje: error.message,
            timestamp: new Date().toISOString()
        }
    }];
}

// CONSEJOS IMPORTANTES:
// 1. Usa try-catch para operaciones que pueden fallar
// 2. Proporciona mensajes de error claros y útiles
// 3. Considera usar reintentos para errores temporales
// 4. Registra los errores para debugging
// 5. Siempre retorna algo, incluso cuando hay errores
