# Anatomía de un Nodo en n8n

## ¿Qué es un Nodo?

Un nodo en n8n es un componente funcional que ejecuta una tarea específica dentro de un workflow de automatización. Cada nodo puede realizar operaciones como obtener datos, transformarlos, enviarlos a otros sistemas o controlar el flujo de ejecución.

## Partes de un Nodo

### 1. Entrada (Input)
**Concepto:** Punto por el que el nodo recibe datos estructurados provenientes del nodo anterior en el workflow.

**Ejemplo técnico:** Un nodo recibe un objeto JSON con información de un cliente extraída de una base de datos.

### 2. Configuración (Settings)
**Concepto:** Parámetros y opciones que definen el comportamiento del nodo, como URLs, credenciales, expresiones o condiciones.

**Ejemplo técnico:** Configurar un nodo HTTP Request con la URL de una API, método GET y cabeceras de autenticación.

### 3. Procesamiento (Processing)
**Concepto:** Lógica interna que el nodo aplica a los datos recibidos, incluyendo transformaciones, validaciones o llamadas a servicios externos.

**Ejemplo técnico:** Un nodo Code que recibe datos, filtra registros según una condición y transforma el formato de salida.

### 4. Salida (Output)
**Concepto:** Resultado generado por el nodo tras el procesamiento, que se envía al siguiente nodo del workflow.

**Ejemplo técnico:** Un nodo Database devuelve una lista de registros que serán procesados por el siguiente nodo.

## Tipos de Nodos

### 1. Nodos Trigger (Disparadores)
**Función:** Inician la ejecución del workflow en respuesta a eventos externos o programados.

**Ejemplos técnicos:**
- **Start Node:** Inicia el workflow manualmente desde la interfaz.
- **Cron Node:** Ejecuta el workflow en intervalos definidos (por ejemplo, cada hora).
- **Webhook Node:** Inicia el workflow al recibir una petición HTTP externa.

### 2. Nodos de Acción (Action Nodes)
**Función:** Ejecutan tareas específicas como llamadas a APIs, envío de emails o manipulación de datos.

**Ejemplos técnicos:**
- **HTTP Request:** Realiza una petición a una API REST y procesa la respuesta.
- **Email Node:** Envía un correo electrónico usando un proveedor configurado.
- **Database Node:** Ejecuta consultas SQL sobre una base de datos.

### 3. Nodos de Control (Control Nodes)
**Función:** Gestionan el flujo de ejecución y la lógica condicional dentro del workflow.

**Ejemplos técnicos:**
- **IF Node:** Evalúa una condición lógica y dirige el flujo según el resultado.
- **Switch Node:** Redirige los datos a diferentes ramas según el valor de un campo.
- **Merge Node:** Combina datos provenientes de múltiples ramas en un solo flujo.

## Propiedades Comunes de los Nodos

### 1. Nombre (Name)
**Concepto:** Identificador personalizado para distinguir el nodo dentro del workflow.

**Ejemplo técnico:** Renombrar un nodo HTTP Request a "Obtener Datos del Cliente" para mayor claridad.

### 2. Notas (Notes)
**Concepto:** Comentarios descriptivos que documentan la función o configuración del nodo.

**Ejemplo técnico:** "Este nodo obtiene la información del cliente desde la API y la convierte a formato JSON."

### 3. Continuar en Error (Continue on Fail)
**Concepto:** Opción que determina si el workflow debe continuar o detenerse ante un error en la ejecución del nodo.

**Ejemplo técnico:** Si está activado, el workflow sigue ejecutándose aunque el nodo falle; si está desactivado, la ejecución se detiene ante el error.

### 4. Tiempo de Espera (Timeout)
**Concepto:** Es el tiempo máximo que el nodo esperará antes de finalizar la operación por falta de respuesta.

**Ejemplo técnico:** Establecer un timeout de 30 segundos en un nodo HTTP Request para evitar esperas indefinidas ante una API lenta.

## Conectores (Connections)

### Conectores de Entrada
- **Main Input:** Entrada principal donde llegan los datos procesados por el nodo anterior.
- **Entradas múltiples:** Algunos nodos pueden recibir datos de varias fuentes para operaciones de combinación o comparación.

### Conectores de Salida
- **Main Output:** Salida principal con los datos procesados.
- **Error Output:** Salida alternativa para el manejo de errores.

## Estados de los Nodos

### 1. No Ejecutado (Not Executed)
**Apariencia:** Gris
**Significado:** El nodo no ha sido ejecutado en la sesión actual.

### 2. Ejecutado Exitosamente (Success)
**Apariencia:** Verde
**Significado:** El nodo procesó los datos correctamente.

### 3. Error
**Apariencia:** Rojo
**Significado:** El nodo encontró un error durante la ejecución.

### 4. Ejecutándose (Running)
**Apariencia:** Amarillo/Naranja
**Significado:** El nodo está procesando datos en ese momento.

## Configuración Avanzada

### Variables de Entorno
**Concepto:** Valores externos que pueden parametrizar el comportamiento de los nodos y workflows sin modificar la configuración interna.

**Ejemplo técnico:** Definir la URL base de una API como variable de entorno para facilitar despliegues en diferentes entornos (desarrollo, pruebas, producción).

### Expresiones
**Concepto:** Fórmulas dinámicas que permiten calcular valores en tiempo de ejecución usando datos del workflow.

**Ejemplo técnico:** `{{ $json.nombre }}` accede dinámicamente al campo "nombre" del objeto JSON procesado.

## Mejores Prácticas

### 1. Nombres Descriptivos
❌ **Malo:** "HTTP Request"
✅ **Bueno:** "Obtener Lista de Productos"

### 2. Usa Notas
```
Nota: Este nodo obtiene los pedidos del día actual desde la API de ventas y los formatea para enviar por email al equipo de logística.
```

### 3. Manejo de Errores
Siempre define el comportamiento ante fallos:
- ¿Continuar con el siguiente paso?
- ¿Detener la ejecución?
- ¿Enviar una alerta o registrar el error?

## Próximos Pasos

1. Aprende sobre [Configuración del Entorno](./02_Configuracion_Entorno.md)
2. Practica con [Nodos Esenciales](../01_Nodos_Esenciales_y_Flujo/)
3. Experimenta con [Manejo de Datos](../02_Manejo_de_Datos_y_Expresiones/)

---

**Nota:** El dominio de la anatomía y configuración de los nodos es fundamental para diseñar workflows eficientes, robustos y escalables en n8n.
