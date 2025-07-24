# Guía de Contribución - Enciclopedia n8n

## ¡Gracias por Contribuir!

Esta enciclopedia es un proyecto comunitario. Tu contribución ayuda a miles de personas a aprender n8n de manera más fácil y efectiva.

## Cómo Contribuir

### 1. Tipos de Contribuciones Bienvenidas

#### 📚 Contenido Educativo
- Nuevos tutoriales y guías
- Ejemplos prácticos
- Casos de uso reales
- Explicaciones mejoradas

#### 🐛 Correcciones
- Errores tipográficos
- Código que no funciona
- Enlaces rotos
- Información desactualizada

#### 🔧 Mejoras Técnicas
- Workflows más eficientes
- Nuevas integraciones
- Optimizaciones de rendimiento
- Mejores prácticas

#### 🌍 Localización
- Mejoras en español
- Ejemplos culturalmente relevantes
- Correcciones de idioma

### 2. Proceso de Contribución

#### Paso 1: Fork y Clone
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork localmente
git clone https://github.com/TU_USUARIO/enciclopedia-n8n.git
cd enciclopedia-n8n
```

#### Paso 2: Crear Rama
```bash
# Crea una rama para tu contribución
git checkout -b mi-contribucion
```

#### Paso 3: Hacer Cambios
- Sigue las [Guías de Estilo](#guías-de-estilo)
- Prueba tus workflows antes de enviarlos
- Documenta tus cambios

#### Paso 4: Commit y Push
```bash
# Añade tus cambios
git add .

# Commit con mensaje descriptivo
git commit -m "Agregar tutorial de integración con Slack"

# Push a tu fork
git push origin mi-contribucion
```

#### Paso 5: Pull Request
- Crea un Pull Request desde tu fork
- Usa la [plantilla de PR](.github/PULL_REQUEST_TEMPLATE.md)
- Espera revisión y feedback

## Guías de Estilo

### 1. Estructura de Documentos

#### Formato Markdown
```markdown
# Título Principal

## Introducción
Breve explicación del concepto.

**Ejemplo:** Analogía técnica.

## Concepto Detallado
Explicación técnica completa.

### Subsecciones
- Punto 1
- Punto 2
- Punto 3

## Ejemplos Prácticos
Código o workflows funcionales.

## Próximos Pasos
Enlaces a contenido relacionado.

---

**Recuerda:** Mensaje motivacional final.
```

### 2. Estilo de Escritura

#### Tono
- **Amigable:** Como explicar a un amigo
- **Claro:** Sin jerga innecesaria
- **Positivo:** Enfocado en lo que SÍ se puede hacer

#### Estructura
1. **Concepto:** Qué es y por qué es importante
2. **Ejemplo:** Analogía técnica
3. **Explicación técnica:** Detalles completos
4. **Ejemplos prácticos:** Código funcional
5. **Casos de uso:** Aplicaciones reales

#### Ejemplos de Buena Escritura

✅ **Bueno:**
```markdown
## El Nodo HTTP Request

**Concepto:** El nodo HTTP Request es como un mensajero que puede ir a cualquier lugar de internet y traerte información.

**Ejemplo:** Es como enviar parámetros a una función. Le proporcionas los datos específicos (parámetros) y la función te devuelve el resultado esperado.
```

❌ **Malo:**
```markdown
## HTTP Request Node

Este nodo ejecuta peticiones HTTP usando diversos métodos REST para interfaz con APIs externas mediante protocolos estándar.
```

### 3. Workflows JSON

#### Estándar de Calidad
- **Funcional:** Debe ejecutarse sin errores
- **Comentado:** Cada nodo debe tener notas explicativas
- **Limpio:** Nombres descriptivos, no "HTTP Request 1"
- **Práctico:** Soluciona un problema real

#### Ejemplo de Nodo Bien Documentado
```json
{
  "parameters": {
    "url": "https://api.github.com/users/{{$json.username}}"
  },
  "name": "Obtener Perfil de GitHub",
  "notes": "Este nodo consulta la API de GitHub para obtener información pública del usuario. Requiere un username válido en el campo 'username' del item anterior.",
  "type": "n8n-nodes-base.httpRequest"
}
```

### 4. Código JavaScript

#### Estándares
- **Comentado:** Explica qué hace cada sección
- **Legible:** Nombres de variables descriptivos
- **Seguro:** Maneja errores y casos extremos

#### Ejemplo
```javascript
// Procesar datos del usuario
const userData = items[0].json;

// Verificar que existe el campo requerido
if (!userData.email) {
  throw new Error('El campo email es requerido');
}

// Crear respuesta formateada
const response = {
  email: userData.email.toLowerCase(),
  nombreCompleto: `${userData.nombre} ${userData.apellido}`,
  fechaRegistro: new Date().toISOString()
};

return [{ json: response }];
```

## Revisión de Contenido

### Checklist de Calidad

#### Para Documentación
- [ ] Título claro y descriptivo
- [ ] Introducción con "Ejemplo"
- [ ] Explicación técnica completa
- [ ] Ejemplos prácticos funcionales
- [ ] Enlaces a contenido relacionado
- [ ] Ortografía y gramática correctas

#### Para Workflows
- [ ] Se ejecuta sin errores
- [ ] Todos los nodos tienen notas
- [ ] Nombres descriptivos
- [ ] Maneja casos de error
- [ ] Incluye datos de prueba
- [ ] Documenta credenciales necesarias

#### Para Código
- [ ] Comentarios explicativos
- [ ] Manejo de errores
- [ ] Variables con nombres descriptivos
- [ ] Funciona con los datos esperados
- [ ] Incluye validaciones básicas

### Proceso de Revisión

1. **Auto-revisión:** Usa el checklist antes de enviar
2. **Revisión técnica:** Verificamos que funcione
3. **Revisión de contenido:** Evaluamos claridad y utilidad
4. **Feedback:** Te damos sugerencias de mejora
5. **Aprobación:** Merge a la rama principal

## Comunidad y Soporte

### 🆘 ¿Necesitas Ayuda?

#### Para Preguntas sobre Contribución
- **GitHub Issues:** Para problemas técnicos
- **GitHub Discussions:** Para ideas y preguntas generales

#### Para Preguntas sobre n8n
- **Foro Oficial:** [community.n8n.io](https://community.n8n.io)
- **Discord:** [discord.gg/n8n](https://discord.gg/n8n)

### 🎯 Prioridades Actuales

#### Contenido Más Necesario
1. **Más ejemplos prácticos** de casos de uso reales
2. **Integraciones populares** (Slack, Google, etc.)
3. **Solución de problemas** comunes
4. **Optimización** de workflows

#### Áreas que Necesitan Atención
- Ejemplos con datos reales (sin credenciales)
- Más casos de uso de negocios
- Patrones de error handling
- Workflows para principiantes

## Reconocimientos

### 🏆 Contribuidores Destacados

Los contribuidores más activos serán reconocidos en:
- README principal del proyecto
- Sección de agradecimientos
- Menciones en redes sociales

### 📈 Métricas de Impacto

Te mantendremos informado sobre:
- Cuántas personas han usado tu contenido
- Feedback de la comunidad
- Impacto en el aprendizaje

## Código de Conducta

### 🤝 Nuestros Valores

#### Respeto
- Trata a todos con cortesía
- Acepta críticas constructivas
- Ofrece feedback útil

#### Colaboración
- Comparte conocimiento abiertamente
- Ayuda a otros contribuidores
- Celebra los éxitos de la comunidad

#### Calidad
- Prueba tu código antes de enviar
- Documenta claramente
- Mantén estándares altos

### 🚫 Comportamientos Inaceptables

- Lenguaje ofensivo o discriminatorio
- Ataques personales
- Spam o autopromoción excesiva
- Publicar credenciales reales

## Licencia

Al contribuir, aceptas que tu contenido se publique bajo la [Licencia MIT](LICENSE).

---

**¡Gracias por hacer de n8n una herramienta más accesible para todos!** 🚀

Tu contribución, sin importar el tamaño, ayuda a construir una comunidad más fuerte y conocedora. ¡Esperamos tu Pull Request!
