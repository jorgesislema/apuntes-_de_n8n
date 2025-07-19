# Desarrollo de Nodos Personalizados

## Introducción

Los nodos personalizados te permiten extender n8n con funcionalidades específicas que no están disponibles en los nodos predeterminados.

**Ejemplo:** Es como crear herramientas especializadas para tu taller. Cuando las herramientas estándar no cubren tus necesidades específicas, puedes fabricar tu propia herramienta personalizada.

## ¿Cuándo Crear un Nodo Personalizado?

### Situaciones Apropiadas:
- **APIs específicas** que no tienen nodo oficial
- **Lógica de negocio compleja** que se repite frecuentemente
- **Transformaciones de datos** muy específicas
- **Integraciones con sistemas internos**

### Antes de Crear un Nodo:
1. Verifica si ya existe un nodo similar
2. Considera si puedes usar el nodo HTTP Request + Code
3. Evalúa si la funcionalidad se usará frecuentemente

## Estructura de un Nodo Personalizado

### Archivos Principales:
```
mi-nodo-personalizado/
├── package.json
├── nodes/
│   ├── MiNodo/
│   │   ├── MiNodo.node.ts
│   │   ├── MiNodo.node.json
│   │   └── mi-nodo.svg
│   └── index.ts
├── credentials/
│   ├── MiCredencial.credentials.ts
│   └── index.ts
└── dist/
```

## Contenido del Capítulo

### 1. [Anatomía de un Nodo Personalizado](./01_Anatomia_de_un_Nodo_Personalizado.md)
- Estructura de archivos TypeScript
- Interfaces y tipos requeridos
- Configuración de propiedades del nodo

### 2. [Ejemplo Nodo Comunidad](./ejemplo-nodo-comunidad/)
- Ejemplo completo funcional
- Nodo listo para publicar
- Buenas prácticas implementadas

## Herramientas Necesarias

### Software Requerido:
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **TypeScript** (instalado globalmente)
- **Editor de código** (VS Code recomendado)

### Paquetes npm Importantes:
- `n8n-workflow` - Tipos y utilidades base
- `n8n-core` - Funcionalidades principales
- `@types/node` - Tipos de Node.js

### Configuración Inicial:
```bash
# Instalar TypeScript globalmente
npm install -g typescript

# Crear proyecto base
mkdir mi-nodo-personalizado
cd mi-nodo-personalizado
npm init -y

# Instalar dependencias
npm install --save-dev n8n-workflow @types/node typescript
```

## Mejores Prácticas

### 1. Nomenclatura
```typescript
// ✅ Bueno: CamelCase para clases
class MiNodoPersonalizado implements INodeType

// ✅ Bueno: kebab-case para identificadores
displayName: 'Mi Nodo Personalizado'
name: 'miNodoPersonalizado'
```

### 2. Documentación
- Documenta todos los parámetros
- Incluye ejemplos de uso
- Especifica tipos de datos esperados

### 3. Manejo de Errores
```typescript
try {
  // Lógica del nodo
} catch (error) {
  throw new NodeOperationError(this.getNode(), error);
}
```

### 4. Validación de Datos
```typescript
if (!inputData.length) {
  throw new NodeOperationError(this.getNode(), 'No hay datos de entrada');
}
```

## Recursos Útiles

### Documentación Oficial:
- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Workflow Types](https://docs.n8n.io/integrations/creating-nodes/build/)

### Repositorios de Ejemplo:
- [n8n-nodes-starter](https://github.com/n8n-io/n8n-nodes-starter)
- [Community Nodes](https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes)

### Herramientas de Desarrollo:
- [n8n-node-dev](https://www.npmjs.com/package/n8n-node-dev) - CLI para desarrollo
- [Node Creator](https://www.npmjs.com/package/create-n8n-node) - Generador de nodos

## Limitaciones y Consideraciones

### Limitaciones Técnicas:
- Los nodos deben ser síncronos o usar async/await
- Memoria limitada para procesamiento
- Acceso restringido al sistema de archivos

### Consideraciones de Seguridad:
- Nunca hardcodear credenciales
- Validar todas las entradas
- Sanitizar datos antes de procesarlos

### Rendimiento:
- Evitar bucles infinitos
- Optimizar el uso de memoria
- Implementar timeouts apropiados

## Próximos Pasos

1. Estudia la [Anatomía de un Nodo Personalizado](./01_Anatomia_de_un_Nodo_Personalizado.md)
2. Revisa el [Ejemplo Nodo Comunidad](./ejemplo-nodo-comunidad/)
3. Explora [Administración y Escalado](../08_Administracion_y_Escalado_(Self-Hosting)/)
4. Practica con [Recetario de Soluciones](../09_Recetario_de_Soluciones_(Cookbook)/)

---

**Recuerda:** Crear nodos personalizados es una habilidad avanzada que requiere conocimientos de TypeScript y la arquitectura de n8n. Comienza con casos simples y ve aumentando la complejidad gradualmente. 🛠️
