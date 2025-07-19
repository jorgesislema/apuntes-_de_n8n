# Ejemplo Nodo Comunidad

## JSONPlaceholder API Node

Este es un ejemplo completo de un nodo personalizado para n8n que interactúa con la API de JSONPlaceholder. Sirve como plantilla para crear tus propios nodos.

## Características

- ✅ **Funcional**: Listo para usar con JSONPlaceholder API
- ✅ **Completo**: Incluye credenciales, validación y manejo de errores
- ✅ **Documentado**: Código bien comentado y explicado
- ✅ **Testeado**: Incluye tests unitarios
- ✅ **Publicable**: Configurado para publicar en npm

## Operaciones Soportadas

### Posts:
- **Get All Posts** - Obtiene todos los posts
- **Get Post** - Obtiene un post específico por ID
- **Create Post** - Crea un nuevo post
- **Update Post** - Actualiza un post existente
- **Delete Post** - Elimina un post

### Users:
- **Get All Users** - Obtiene todos los usuarios
- **Get User** - Obtiene un usuario específico por ID

## Estructura del Proyecto

```
ejemplo-nodo-comunidad/
├── package.json
├── tsconfig.json
├── gulpfile.js
├── .eslintrc.js
├── nodes/
│   ├── JsonPlaceholder/
│   │   ├── JsonPlaceholder.node.ts
│   │   ├── JsonPlaceholder.node.json
│   │   └── jsonplaceholder.svg
│   └── index.ts
├── credentials/
│   ├── JsonPlaceholderApi.credentials.ts
│   └── index.ts
├── test/
│   └── JsonPlaceholder.test.ts
└── dist/
    └── (archivos compilados)
```

## Instalación

### Para Desarrollo:
```bash
# Clonar o copiar este directorio
cd ejemplo-nodo-comunidad

# Instalar dependencias
npm install

# Compilar
npm run build

# Enlazar para desarrollo local
npm link

# En tu instalación de n8n
npm link n8n-nodes-jsonplaceholder
```

### Para Producción:
```bash
npm install n8n-nodes-jsonplaceholder
```

## Configuración

### 1. Instalar el Nodo:
- Instala el paquete npm
- Reinicia n8n
- El nodo aparecerá en la categoría "Input"

### 2. Configurar Credenciales (Opcional):
- Crea credenciales "JSONPlaceholder API"
- Configura la URL base (por defecto: https://jsonplaceholder.typicode.com)

### 3. Usar el Nodo:
- Arrastra el nodo "JSONPlaceholder" a tu workflow
- Selecciona el recurso (Posts/Users)
- Selecciona la operación
- Configura los parámetros necesarios

## Ejemplos de Uso

### Obtener Todos los Posts:
```json
{
  "resource": "post",
  "operation": "getAll",
  "returnAll": true
}
```

### Crear un Nuevo Post:
```json
{
  "resource": "post",
  "operation": "create",
  "title": "Mi Nuevo Post",
  "body": "Contenido del post",
  "userId": 1
}
```

### Obtener Usuario por ID:
```json
{
  "resource": "user",
  "operation": "get",
  "userId": 1
}
```

## Personalización

### Agregar Nuevas Operaciones:
1. Modifica `JsonPlaceholder.node.ts`
2. Agrega nuevas opciones en `properties`
3. Implementa la lógica en el método `execute`
4. Actualiza los tests

### Agregar Nuevos Recursos:
1. Agrega el recurso en las opciones
2. Crea las operaciones específicas
3. Implementa los métodos correspondientes
4. Actualiza la documentación

## Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## Publicación

### Preparar para Publicación:
```bash
# Lint y build
npm run lint
npm run build

# Actualizar versión
npm version patch|minor|major

# Publicar en npm
npm publish
```

### Registrar en n8n Community:
1. Publica en npm con tag `n8n-community-node-package`
2. Envía PR al repositorio de n8n para incluirlo en la lista oficial
3. Comparte en la comunidad de n8n

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Implementa los cambios
4. Agrega tests
5. Envía un Pull Request

## Licencia

MIT - Ver archivo LICENSE para detalles

## Soporte

- **Issues**: GitHub Issues
- **Documentación**: [n8n Node Development Docs](https://docs.n8n.io/integrations/creating-nodes/)
- **Comunidad**: [n8n Community](https://community.n8n.io/)

---

**Nota**: Este es un ejemplo educativo. Para producción, considera agregar más validaciones, manejo de errores robusto y tests más comprehensivos.
