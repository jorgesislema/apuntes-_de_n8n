# OpenAI - Guía Completa de Integración

## ¿Qué es OpenAI?

OpenAI es una plataforma de **inteligencia artificial avanzada** que ofrece modelos de lenguaje capaces de entender y generar texto, analizar imágenes, crear código, traducir idiomas y realizar tareas complejas de procesamiento de lenguaje natural. En n8n, permite automatizar procesos que requieren capacidades de IA.

### Concepto Técnico
OpenAI funciona mediante:
- **Modelos de lenguaje**: GPT-4, GPT-3.5-turbo para procesamiento de texto
- **Procesamiento de prompts**: Instrucciones específicas para obtener resultados deseados
- **API REST**: Interfaz para integración con aplicaciones externas
- **Tokens**: Unidades de medida para el procesamiento de texto

## Configuración Inicial

### 1. **Obtener API Key**

#### Paso 1: Crear Cuenta
1. Ve a [OpenAI Platform](https://platform.openai.com)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys**
4. Clic en **Create new secret key**
5. **¡IMPORTANTE!** Copia la key inmediatamente (solo se muestra una vez)

#### Paso 2: Configurar Billing
1. Ve a **Billing** → **Payment methods**
2. Agrega una tarjeta de crédito
3. Configura límites de uso (recomendado: $10-20/mes para empezar)

### 2. **Configurar en n8n**

#### Método 1: Credenciales OpenAI
1. **Credentials** → **Add Credential**
2. **OpenAI**
3. Pega tu API Key
4. **Save**

#### Método 2: HTTP Request Manual
```javascript
// Headers para HTTP Request
{
  "Authorization": "Bearer {{ $credentials.openai.api_key }}",
  "Content-Type": "application/json"
}
```

## 🧠 Modelos Disponibles

### 1. **GPT-4 Turbo** (Recomendado)
- **Modelo:** `gpt-4-turbo-preview`
- **Fortalezas:** Mejor razonamiento, más actual, más tokens
- **Costo:** ~$0.01 por 1K tokens input, ~$0.03 por 1K tokens output
- **Uso:** Tareas complejas, análisis, código avanzado

### 2. **GPT-3.5 Turbo** (Económico)
- **Modelo:** `gpt-3.5-turbo`
- **Fortalezas:** Rápido, económico, eficiente
- **Costo:** ~$0.0015 por 1K tokens input, ~$0.002 por 1K tokens output
- **Uso:** Tareas simples, chatbots, clasificación

### 3. **GPT-4 Vision** (Imágenes)
- **Modelo:** `gpt-4-vision-preview`
- **Fortalezas:** Puede analizar imágenes
- **Costo:** Variable según resolución
- **Uso:** Análisis de imágenes, OCR, descripción visual

## 📝 Casos de Uso Comunes

### 1. **Chatbot Inteligente**

#### Configuración Básica
```json
{
  "model": "gpt-4-turbo-preview",
  "messages": [
    {
      "role": "system",
      "content": "Eres un asistente útil y amigable. Responde de manera concisa y profesional."
    },
    {
      "role": "user",
      "content": "{{ $json.mensaje_usuario }}"
    }
  ],
  "max_tokens": 150,
  "temperature": 0.7
}
```

#### Workflow: Webhook → OpenAI → Respuesta
```javascript
// En nodo Code - Preparar contexto
const conversacion = [
  {
    role: "system",
    content: "Eres un asistente de atención al cliente de una empresa de tecnología. Sé helpful pero conciso."
  },
  {
    role: "user",
    content: $json.mensaje
  }
];

return [{
  json: {
    messages: conversacion,
    max_tokens: 200,
    temperature: 0.7
  }
}];
```

### 2. **Análisis de Sentimientos**

#### Prompt Especializado
```javascript
// En nodo Set - Preparar prompt
const prompt = `Analiza el sentimiento del siguiente texto y clasifícalo como POSITIVO, NEGATIVO o NEUTRAL.

Texto: "${$json.comentario}"

Responde en formato JSON:
{
  "sentimiento": "POSITIVO/NEGATIVO/NEUTRAL",
  "confianza": 0.85,
  "razon": "Explicación breve"
}`;

return [{
  json: {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 100,
    temperature: 0.3
  }
}];
```

### 3. **Generación de Contenido**

#### Blog Posts Automáticos
```javascript
// En nodo Code - Crear prompt para blog
const tema = $json.tema;
const palabrasClave = $json.palabras_clave || [];

const prompt = `Escribe un artículo de blog sobre "${tema}".

Requisitos:
- Longitud: 500-800 palabras
- Tono: Profesional pero accesible
- Incluir palabras clave: ${palabrasClave.join(', ')}
- Estructura: Introducción, desarrollo, conclusión
- Incluir call-to-action al final

Formato: Markdown`;

return [{
  json: {
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "Eres un experto copywriter especializado en crear contenido web optimizado."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 1200,
    temperature: 0.8
  }
}];
```

### 4. **Traducción Inteligente**

#### Traducción con Contexto
```javascript
// En nodo Set - Preparar traducción
const prompt = `Traduce el siguiente texto del ${$json.idioma_origen} al ${$json.idioma_destino}.

Texto original: "${$json.texto}"

Instrucciones:
- Mantén el tono y estilo original
- Adapta expresiones culturales cuando sea necesario
- Si hay términos técnicos, mantenlos apropiados para el idioma destino

Responde solo con la traducción.`;

return [{
  json: {
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 300,
    temperature: 0.3
  }
}];
```

### 5. **Generación de Código**

#### Asistente de Programación
```javascript
// En nodo Code - Generar código
const solicitud = $json.solicitud;
const lenguaje = $json.lenguaje || 'JavaScript';

const prompt = `Genera código en ${lenguaje} para: ${solicitud}

Requisitos:
- Código limpio y bien comentado
- Incluir manejo de errores
- Agregar ejemplos de uso
- Explicar la lógica brevemente

Formato:
\`\`\`${lenguaje.toLowerCase()}
// Código aquí
\`\`\`

Explicación: [Explicación breve]`;

return [{
  json: {
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "Eres un programador experto que genera código limpio y bien documentado."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 800,
    temperature: 0.4
  }
}];
```

## 🛠️ Técnicas Avanzadas

### 1. **Prompt Engineering**

#### Estructura de Prompt Efectivo
```javascript
const promptEstructurado = `
## ROL
Eres un experto en [área específica]

## CONTEXTO
[Información relevante sobre la situación]

## TAREA
[Descripción clara de lo que necesitas]

## FORMATO
[Cómo quieres que responda]

## EJEMPLO
[Ejemplo de respuesta esperada]

## RESTRICCIONES
- [Limitación 1]
- [Limitación 2]
- [Limitación 3]
`;
```

#### Técnicas de Mejora
```javascript
// 1. Few-shot learning (ejemplos)
const prompt = `Clasifica estos comentarios como positivos o negativos:

Ejemplo 1: "Me encanta este producto" → Positivo
Ejemplo 2: "Terrible servicio al cliente" → Negativo
Ejemplo 3: "Funciona bien pero podría mejorar" → Neutral

Ahora clasifica: "${$json.comentario}"`;

// 2. Chain of thought (razonamiento paso a paso)
const prompt = `Resuelve este problema paso a paso:

Problema: ${$json.problema}

Paso 1: Identifica los datos dados
Paso 2: Determina qué necesitas encontrar
Paso 3: Elige el método apropiado
Paso 4: Resuelve paso a paso
Paso 5: Verifica el resultado`;

// 3. Role playing (juego de roles)
const prompt = `Actúa como un experto en marketing digital con 10 años de experiencia. 
Analiza esta campaña y da recomendaciones específicas y accionables.

Campaña: ${$json.descripcion_campana}`;
```

### 2. **Manejo de Tokens**

#### Optimización de Costos
```javascript
// En nodo Code - Calcular tokens aproximados
const contarTokens = (texto) => {
  // Aproximación: 1 token ≈ 4 caracteres en inglés
  return Math.ceil(texto.length / 4);
};

const prompt = $json.prompt;
const tokensEstimados = contarTokens(prompt);

// Ajustar max_tokens según el prompt
const maxTokens = Math.min(tokensEstimados + 200, 1000);

return [{
  json: {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7
  }
}];
```

#### Truncado Inteligente
```javascript
// Truncar contenido largo manteniendo contexto
const truncarTexto = (texto, maxTokens = 3000) => {
  const maxChars = maxTokens * 4; // Aproximación
  
  if (texto.length <= maxChars) {
    return texto;
  }
  
  // Truncar pero mantener párrafos completos
  const truncado = texto.substring(0, maxChars);
  const ultimoPunto = truncado.lastIndexOf('.');
  
  return ultimoPunto > maxChars * 0.8 ? 
    truncado.substring(0, ultimoPunto + 1) : 
    truncado;
};
```

### 3. **Prompts Dinámicos**

#### Generación Basada en Contexto
```javascript
// En nodo Code - Crear prompt dinámico
const crearPrompt = (usuario, contexto) => {
  const tipoUsuario = usuario.tipo || 'general';
  const historial = contexto.historial || [];
  
  let systemPrompt = "Eres un asistente útil.";
  
  switch (tipoUsuario) {
    case 'tecnico':
      systemPrompt = "Eres un experto técnico. Usa terminología precisa y da detalles técnicos.";
      break;
    case 'principiante':
      systemPrompt = "Eres un tutor paciente. Explica conceptos de manera simple y con ejemplos.";
      break;
    case 'ejecutivo':
      systemPrompt = "Eres un consultor de negocios. Enfócate en impacto comercial y ROI.";
      break;
  }
  
  // Agregar contexto del historial
  if (historial.length > 0) {
    const contextoHistorial = historial
      .slice(-3) // Últimas 3 interacciones
      .map(h => `Usuario: ${h.pregunta}\nAsistente: ${h.respuesta}`)
      .join('\n\n');
    
    systemPrompt += `\n\nContexto de conversación previa:\n${contextoHistorial}`;
  }
  
  return systemPrompt;
};
```

### 4. **Validación y Post-procesamiento**

#### Validar Respuestas
```javascript
// En nodo Code - Validar respuesta de OpenAI
const validarRespuesta = (respuesta) => {
  const errores = [];
  
  // Verificar longitud
  if (respuesta.length < 10) {
    errores.push('Respuesta demasiado corta');
  }
  
  // Verificar si es JSON válido (si se esperaba JSON)
  if ($json.formato === 'json') {
    try {
      JSON.parse(respuesta);
    } catch (e) {
      errores.push('Respuesta no es JSON válido');
    }
  }
  
  // Verificar palabras prohibidas
  const palabrasProhibidas = ['error', 'no puedo', 'no sé'];
  const contieneProhibidas = palabrasProhibidas.some(palabra => 
    respuesta.toLowerCase().includes(palabra)
  );
  
  if (contieneProhibidas) {
    errores.push('Respuesta contiene palabras prohibidas');
  }
  
  return {
    valida: errores.length === 0,
    errores: errores
  };
};
```

#### Formatear Respuestas
```javascript
// En nodo Code - Formatear respuesta
const formatearRespuesta = (respuesta, formato) => {
  switch (formato) {
    case 'markdown':
      return respuesta.replace(/\n/g, '  \n'); // Markdown line breaks
    
    case 'html':
      return respuesta
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    case 'json':
      try {
        return JSON.parse(respuesta);
      } catch (e) {
        return { error: 'Respuesta no es JSON válido', raw: respuesta };
      }
    
    case 'lista':
      return respuesta
        .split('\n')
        .filter(linea => linea.trim())
        .map(linea => linea.replace(/^-\s*/, ''));
    
    default:
      return respuesta;
  }
};
```

## 📊 Monitoreo y Optimización

### 1. **Tracking de Costos**

#### Calcular Costo por Request
```javascript
// En nodo Code - Calcular costo
const calcularCosto = (modelo, tokensInput, tokensOutput) => {
  const precios = {
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'gpt-4-vision-preview': { input: 0.01, output: 0.03 }
  };
  
  const precio = precios[modelo] || precios['gpt-3.5-turbo'];
  
  const costoInput = (tokensInput / 1000) * precio.input;
  const costoOutput = (tokensOutput / 1000) * precio.output;
  
  return {
    costoInput: costoInput,
    costoOutput: costoOutput,
    costoTotal: costoInput + costoOutput,
    tokensInput: tokensInput,
    tokensOutput: tokensOutput
  };
};
```

### 2. **Métricas de Performance**

#### Tracking de Respuestas
```javascript
// En nodo Code - Métricas de respuesta
const analizarRespuesta = (respuesta, tiempoInicio) => {
  const tiempoFin = Date.now();
  const tiempoRespuesta = tiempoFin - tiempoInicio;
  
  return {
    tiempoRespuesta: tiempoRespuesta,
    longitudRespuesta: respuesta.length,
    palabras: respuesta.split(' ').length,
    calidad: respuesta.includes('no puedo') ? 'baja' : 'alta',
    timestamp: new Date().toISOString()
  };
};
```

## 🚨 Manejo de Errores

### 1. **Errores Comunes**

#### Rate Limiting
```javascript
// En nodo Code - Manejo de rate limiting
const manejarRateLimit = async (funcion, maxReintentos = 3) => {
  for (let intento = 0; intento < maxReintentos; intento++) {
    try {
      return await funcion();
    } catch (error) {
      if (error.response?.status === 429) {
        const delay = Math.pow(2, intento) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Rate limit excedido después de varios intentos');
};
```

#### Timeout Handling
```javascript
// En nodo Code - Timeout personalizado
const conTimeout = (promesa, timeout = 30000) => {
  return Promise.race([
    promesa,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};
```

### 2. **Fallbacks Inteligentes**

#### Modelo de Respaldo
```javascript
// En nodo Code - Fallback a modelo más simple
const procesarConFallback = async (prompt) => {
  try {
    // Intentar con GPT-4 primero
    return await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    });
  } catch (error) {
    console.log('GPT-4 falló, usando GPT-3.5');
    
    // Fallback a GPT-3.5
    return await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    });
  }
};
```

## 📋 Checklist de Buenas Prácticas

### ✅ Configuración
- [ ] API Key segura (no hardcodeada)
- [ ] Límites de billing configurados
- [ ] Modelo apropiado para cada caso de uso
- [ ] Timeouts configurados

### ✅ Prompts
- [ ] Prompts claros y específicos
- [ ] Contexto suficiente pero no excesivo
- [ ] Formato de respuesta especificado
- [ ] Ejemplos cuando sea necesario

### ✅ Performance
- [ ] Optimización de tokens
- [ ] Caché para respuestas repetitivas
- [ ] Batch processing cuando sea posible
- [ ] Monitoreo de costos

### ✅ Manejo de Errores
- [ ] Retry logic para failures temporales
- [ ] Fallbacks a modelos alternativos
- [ ] Validación de respuestas
- [ ] Logging para debugging

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Chatbot Especializado
Crea un chatbot que:
1. Identifique el tipo de consulta (soporte, ventas, general)
2. Use prompts específicos para cada tipo
3. Mantenga contexto de conversación
4. Escale a humano cuando sea necesario

### Ejercicio 2: Analizador de Feedback
Crea un sistema que:
1. Analice comentarios de clientes
2. Extraiga temas principales
3. Clasifique por urgencia
4. Genere respuestas sugeridas

### Ejercicio 3: Generador de Contenido
Crea un workflow que:
1. Genere títulos para blog posts
2. Cree outlines detallados
3. Escriba contenido completo
4. Optimice para SEO

---

**Recuerda:** OpenAI es una herramienta poderosa que requiere uso correcto y responsable. Experimenta con diferentes prompts, modelos y configuraciones para encontrar lo que funciona mejor para tu caso de uso específico.
