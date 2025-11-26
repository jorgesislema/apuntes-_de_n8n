# Catálogo Maestro de Nodos n8n

Esta referencia técnica clasifica y analiza los nodos más críticos de n8n. No es una lista exhaustiva de las 1000+ integraciones, sino un análisis profundo de los nodos *core* y funcionales que constituyen la base de cualquier arquitectura de automatización.

## Índice de Categorías

1. [Nodos Trigger (Disparadores)](#1-nodos-trigger-disparadores)
2. [Control de Flujo y Lógica](#2-control-de-flujo-y-lógica)
3. [Manipulación y Transformación de Datos](#3-manipulación-y-transformación-de-datos)
4. [Utilidades Core y Conectividad](#4-utilidades-core-y-conectividad)

---

## 1. Nodos Trigger (Disparadores)

Los nodos Trigger son el punto de entrada de cualquier workflow.

### **Webhook**
**Utilidad:** Inicia el workflow al recibir una petición HTTP (GET, POST, etc.) desde un sistema externo.
- **Tipo:** Event-based.
- **Ventajas:**
    - **Tiempo Real:** Ejecución inmediata, sin latencia de sondeo.
    - **Eficiencia:** Consume recursos solo cuando ocurre un evento.
    - **Flexibilidad:** Compatible con cualquier sistema que pueda hacer peticiones HTTP.
- **Desventajas:**
    - **Dependencia Externa:** Si el sistema emisor falla, el workflow no se entera.
    - **Seguridad:** Requiere configuración cuidadosa de autenticación para evitar ejecuciones no autorizadas.

### **Schedule (Cron)**
**Utilidad:** Ejecuta workflows en intervalos de tiempo predefinidos (ej. "cada hora", "todos los lunes").
- **Tipo:** Time-based.
- **Ventajas:**
    - **Previsibilidad:** Ideal para tareas de mantenimiento, reportes o backups.
    - **Independencia:** No depende de eventos externos.
- **Desventajas:**
    - **Latencia:** No es tiempo real. Los datos pueden estar desactualizados hasta la próxima ejecución.
    - **Recursos:** Ejecuciones frecuentes innecesarias pueden desperdiciar recursos si no hay datos nuevos.

### **Manual Trigger**
**Utilidad:** Permite iniciar un workflow manualmente desde la interfaz de n8n.
- **Tipo:** Manual.
- **Ventajas:**
    - **Testing:** Esencial para desarrollo y pruebas.
    - **Control:** Útil para procesos que requieren supervisión humana antes de iniciar.
- **Desventajas:**
    - **No Automatizado:** No sirve para procesos desatendidos.

### **Poll (Sondeo)**
*(Nota: Muchos nodos de integración tienen modo "Poll", como "On New Email")*
**Utilidad:** Consulta periódicamente un servicio para ver si hay cambios.
- **Tipo:** Polling.
- **Ventajas:**
    - **Compatibilidad:** Funciona con servicios que no soportan Webhooks.
- **Desventajas:**
    - **Ineficiencia:** Consume recursos en cada consulta, incluso si no hay datos nuevos.
    - **Retraso:** Hay un delay entre el evento y la ejecución (definido por el intervalo de sondeo).

---

## 2. Control de Flujo y Lógica

Nodos que determinan la ruta de ejecución o gestionan la orquestación.

### **If**
**Utilidad:** Divide el flujo en dos ramas (True/False) basándose en una condición lógica.
- **Ventajas:**
    - **Simplicidad:** Fácil de entender y configurar para lógica binaria.
- **Desventajas:**
    - **Escalabilidad:** Se vuelve complejo si hay múltiples condiciones anidadas (If dentro de If).

### **Switch**
**Utilidad:** Enruta el flujo a una de múltiples salidas (0, 1, 2, 3...) basándose en reglas.
- **Ventajas:**
    - **Limpieza:** Reemplaza múltiples nodos `If` anidados.
    - **Organización:** Visualmente más claro para lógica compleja.
- **Desventajas:**
    - **Configuración:** Puede ser tedioso definir muchas reglas complejas.

### **Merge**
**Utilidad:** Combina datos de múltiples ramas de entrada en una sola salida.
- **Modos:** Append, Keep Key Matches, Merge by Index, Wait.
- **Ventajas:**
    - **Sincronización:** Permite esperar a que terminen procesos paralelos antes de continuar.
    - **Consolidación:** Unifica datos dispersos.
- **Desventajas:**
    - **Complejidad de Datos:** Entender cómo se combinan los JSONs (especialmente en "Merge by Index") puede ser confuso.
    - **Bloqueo:** En modo "Wait", si una rama falla, el nodo puede quedarse esperando indefinidamente (timeout).

### **Loop Over Items (Split In Batches)**
**Utilidad:** Itera sobre un conjunto de items, permitiendo procesarlos uno por uno o en lotes pequeños.
- **Ventajas:**
    - **Control de Rate Limit:** Evita saturar APIs externas procesando en lotes.
    - **Manejo de Errores:** Permite aislar fallos en items individuales sin detener todo el proceso.
- **Desventajas:**
    - **Rendimiento:** Procesar items uno por uno es mucho más lento que el procesamiento vectorial nativo de n8n.
    - **Complejidad Visual:** Añade bucles visuales al workflow que pueden dificultar la lectura.

---

## 3. Manipulación y Transformación de Datos

Nodos encargados de alterar la estructura JSON de los items.

### **Set (Edit Fields)**
**Utilidad:** Crea, modifica o elimina propiedades en los objetos JSON que fluyen por el workflow.
- **Ventajas:**
    - **Esencial:** Se usa en casi todos los workflows para preparar datos.
    - **Visual:** Permite ver claramente qué campos se están creando.
- **Desventajas:**
    - **Limitado:** Para transformaciones muy complejas (arrays anidados, lógica condicional avanzada), se queda corto frente al nodo Code.

### **Code (JavaScript / Python)**
**Utilidad:** Permite ejecutar código arbitrario para manipular datos con total libertad.
- **Ventajas:**
    - **Potencia Infinita:** Puede hacer cualquier cosa que el lenguaje permita (regex complejo, algoritmos, librerías externas).
    - **Rendimiento:** Generalmente más rápido que encadenar 10 nodos visuales para la misma tarea.
- **Desventajas:**
    - **Curva de Aprendizaje:** Requiere conocimientos de programación.
    - **Mantenibilidad:** El código es "caja negra" para usuarios no técnicos.

### **Aggregate**
**Utilidad:** Agrupa múltiples items individuales en un solo item que contiene una lista (array).
- **Ventajas:**
    - **Preparación de Reportes:** Ideal para crear resúmenes (ej. lista de ventas del día).
    - **Batching:** Necesario antes de enviar datos a APIs que aceptan arrays.
- **Desventajas:**
    - **Memoria:** Agrupar miles de items en uno solo puede consumir mucha memoria RAM.

### **Item Lists**
**Utilidad:** Operaciones específicas sobre listas dentro de items (Split Out, Sort, Limit).
- **Ventajas:**
    - **Split Out:** Convierte un array dentro de un JSON en múltiples items separados (operación inversa a Aggregate).
    - **Conveniencia:** Realiza operaciones comunes sin necesidad de código.
- **Desventajas:**
    - **Especificidad:** Solo útil si tus datos ya tienen estructura de listas.

---

## 4. Utilidades Core y Conectividad

Herramientas fundamentales para interactuar con el mundo exterior.

### **HTTP Request**
**Utilidad:** La "navaja suiza" de n8n. Realiza peticiones HTTP a cualquier API REST/GraphQL.
- **Ventajas:**
    - **Universalidad:** Permite conectar con servicios que no tienen nodo nativo en n8n.
    - **Control Total:** Configuración granular de headers, auth, body, query params.
- **Desventajas:**
    - **Complejidad:** Requiere entender conceptos de APIs (métodos HTTP, JSON, autenticación).

### **Execute Workflow**
**Utilidad:** Llama a otro workflow de n8n (como si fuera una sub-rutina).
- **Ventajas:**
    - **Modularidad:** Permite reutilizar lógica común (ej. un workflow de "Enviar Notificación de Error").
    - **Organización:** Mantiene los workflows principales limpios y manejables.
- **Desventajas:**
    - **Latencia:** Añade un pequeño overhead al iniciar una nueva ejecución.
    - **Debugging:** Seguir el rastro de errores entre workflows anidados puede ser más difícil.

### **Wait**
**Utilidad:** Pausa la ejecución del workflow por un tiempo determinado o hasta una fecha específica.
- **Ventajas:**
    - **Control de Flujo:** Útil para "dar tiempo" a sistemas externos a procesar datos.
    - **Webhooks de Espera:** Puede pausar el workflow hasta que un humano haga clic en un enlace (aprobaciones).
- **Desventajas:**
    - **Recursos:** Los workflows en espera consumen recursos de la base de datos (estado activo).

### **Stop and Error**
**Utilidad:** Detiene forzosamente la ejecución y opcionalmente lanza un error.
- **Ventajas:**
    - **Validación:** Permite detener procesos si los datos no cumplen criterios de calidad.
    - **Seguridad:** Evita que errores se propaguen a sistemas externos.
- **Desventajas:**
    - **Interrupción:** Detiene todo el proceso; debe usarse con cuidado.
