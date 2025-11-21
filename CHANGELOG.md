# Changelog - n8n Referencia Técnica

## [2.0.0] - 2025-11-21

### BREAKING CHANGES
- Reestructuración completa del repositorio de `enciclopedia-n8n` a `n8n-referencia-tecnica`
- Migración de estructura de carpetas a organización profesional
- Eliminación de elementos visuales no esenciales (emojis, iconos)
- Cambio de enfoque de "tutorial amigable" a "referencia técnica"

### Added
- Nueva estructura de directorios optimizada para equipos técnicos
- Carpeta `plantillas/` con workflows categorizados por complejidad
- Documentación estandarizada con análisis de ventajas/desventajas
- Guías técnicas específicas para diferentes roles (DevOps, Backend, Arquitectos)
- Metodología de documentación consistente

### Changed
- Migración de contenido de `00_Principios_Fundamentales/` a `docs/01-fundamentos/`
- Consolidación de nodos esenciales en `docs/02-nodos-core/`
- Reestructuración de manejo de datos en `docs/03-manipulacion-datos/`
- Fusión de scripting y desarrollo de nodos en `docs/04-scripting-avanzado/`
- Unificación de integraciones en `docs/05-integraciones/`
- Agrupación de patrones arquitectónicos en `docs/06-patrones-arquitectura/`
- Consolidación de infraestructura en `docs/07-infraestructura-despliegue/`
- Unificación de seguridad en `docs/08-seguridad-gobierno/`

### Deprecated
- Estructura anterior de carpetas numeradas (01_, 02_, etc.)
- Archivos README.md con tono casual y emojis
- Documentación fragmentada sin análisis técnico profundo

### Removed
- Todos los emojis y elementos visuales no técnicos
- Carpetas redundantes de nodos esenciales
- Archivos de metadata no utilizados (.vs/, configuraciones IDE específicas)
- Contenido duplicado entre diferentes secciones

### Fixed
- Inconsistencias en nomenclatura de archivos
- Documentación desactualizada en varios módulos
- Enlaces rotos entre secciones
- Falta de análisis de rendimiento en ejemplos

### Security
- Revisión de credenciales hardcodeadas en ejemplos
- Actualización de mejores prácticas de seguridad
- Validación de configuraciones de producción

## [1.x] - Histórico

### Versiones Anteriores
Las versiones 1.x del proyecto se mantuvieron como "Enciclopedia n8n" con enfoque educativo y estructura de apuntes. El historial completo está disponible en las etiquetas git correspondientes.

---

## Convenciones de Versionado

Este proyecto sigue [Semantic Versioning](https://semver.org/):

- **MAJOR**: Cambios incompatibles en API o estructura
- **MINOR**: Funcionalidad nueva compatible con versiones anteriores
- **PATCH**: Correcciones de errores compatibles

## Notas de Migración

### Para Usuarios de v1.x

1. **Estructura de Carpetas:** Actualizar referencias de rutas según nueva organización
2. **Enlaces:** Verificar enlaces internos que puedan haber cambiado
3. **Workflows:** Los JSON están ahora en `plantillas/` categorizados por complejidad
4. **Documentación:** Nuevo formato sin emojis y con análisis técnico profundo

### Compatibilidad

- Todos los workflows JSON son compatibles con n8n 1.x y superior
- La documentación mantiene compatibilidad con todas las versiones LTS de n8n
- Los ejemplos de código están validados con Node.js 18+ y Python 3.8+