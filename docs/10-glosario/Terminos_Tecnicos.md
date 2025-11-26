# Glosario Técnico de n8n

Este documento sirve como referencia terminológica estandarizada para el ecosistema de n8n. Las definiciones aquí presentadas buscan precisión técnica y claridad conceptual.

## A

### Activation (Activación)
Estado de un workflow que determina si sus Triggers (disparadores) están escuchando eventos activamente. Un workflow debe estar "Activo" para ejecutarse automáticamente en producción.

### API Key
Credencial de autenticación utilizada para interactuar con la API pública de n8n o servicios externos.

## B

### Batching (Procesamiento por Lotes)
Técnica de dividir un gran conjunto de datos en grupos más pequeños (lotes) para su procesamiento secuencial, evitando sobrecarga de memoria o límites de API.

### Binary Data (Datos Binarios)
Tipo de dato en n8n que representa archivos (imágenes, PDFs, etc.). A diferencia de los datos JSON, los datos binarios no se muestran directamente en la interfaz, sino que se gestionan mediante referencias en memoria.

## C

### Canvas (Lienzo)
El área de trabajo visual donde se diseñan los workflows conectando nodos.

### Credential (Credencial)
Objeto de configuración seguro que almacena información sensible (contraseñas, tokens, claves API) necesaria para autenticarse con servicios externos. Las credenciales se almacenan cifradas.

### Cron
Expresión estándar de Unix utilizada para programar la ejecución de workflows en momentos específicos (ej. `0 9 * * 1` para "todos los lunes a las 9:00").

## D

### Data Transformation (Transformación de Datos)
El proceso de convertir datos de un formato o estructura a otro. En n8n, esto se realiza comúnmente con nodos como `Set`, `Edit Fields` o `Code`.

## E

### Execution (Ejecución)
Una instancia única de un workflow corriendo. Cada ejecución tiene un ID único, un estado (Success, Error, Running) y un registro de los datos procesados.

### Execution ID
Identificador único alfanumérico asignado a cada ejecución de un workflow.

### Expression (Expresión)
Fragmento de código (generalmente JavaScript) utilizado dentro de los parámetros de un nodo para referenciar datos de nodos anteriores o realizar cálculos dinámicos. Se denota con `{{ ... }}`.

## H

### Hardcoding
La mala práctica de escribir valores fijos (como IDs o tokens) directamente en el código o parámetros, en lugar de usar variables o expresiones dinámicas.

## I

### Item (Elemento)
La unidad básica de datos en n8n. Un item es un objeto JSON. Los nodos en n8n procesan arrays de items. Si un nodo recibe 10 items, generalmente se ejecutará 10 veces (o procesará los 10 en lote, dependiendo del nodo).

## J

### JSON (JavaScript Object Notation)
El formato de datos estándar utilizado por n8n para pasar información entre nodos.

## L

### Loop (Bucle)
Estructura de control que permite repetir una serie de acciones. En n8n, los bucles pueden ser implícitos (nodos procesando múltiples items) o explícitos (usando nodos `Loop Over Items` o `Split In Batches`).

## M

### Merge (Fusión)
La acción de combinar datos de dos o más ramas de un workflow en una sola.

## N

### Node (Nodo)
El bloque de construcción fundamental de un workflow. Cada nodo realiza una función específica: iniciar el flujo (Trigger), realizar una acción, transformar datos o controlar la lógica.

## P

### Parameter (Parámetro)
Configuración específica dentro de un nodo que define su comportamiento (ej. URL en un nodo HTTP Request).

### Pin Data (Fijar Datos)
Funcionalidad que permite "congelar" los datos de salida de un nodo para usarlos durante el desarrollo sin tener que re-ejecutar todo el workflow desde el inicio.

### Polling (Sondeo)
Mecanismo de disparo donde n8n consulta periódicamente un servicio externo para verificar si hay nuevos datos, en lugar de esperar a que el servicio envíe una notificación (Webhook).

## S

### Self-hosting
La práctica de alojar n8n en servidores propios en lugar de usar la versión en la nube (n8n Cloud), otorgando control total sobre la infraestructura y los datos.

## T

### Trigger (Disparador)
Tipo especial de nodo que inicia la ejecución de un workflow. Puede ser basado en eventos (Webhook), tiempo (Schedule/Cron), manual o por eventos de aplicaciones.

## V

### Variable de Entorno (Environment Variable)
Valor de configuración global definido a nivel del sistema operativo o contenedor, accesible por n8n. Se usa para configuraciones sensibles o que varían entre entornos (Dev/Prod).

## W

### Webhook
Mecanismo que permite a un sistema externo enviar datos a n8n en tiempo real a través de una petición HTTP. Es el método de disparo más eficiente.

### Workflow (Flujo de Trabajo)
La secuencia completa de nodos conectados que define un proceso de automatización.

### Workflow ID
Identificador único de un workflow almacenado en la base de datos de n8n.
