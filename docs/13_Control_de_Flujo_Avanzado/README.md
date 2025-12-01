# 🔄 Módulo 13: Control de Flujo Avanzado

Este módulo cubre las técnicas necesarias para manejar lógica compleja, grandes volúmenes de datos y orquestación de ejecuciones.

## Contenido
1. **Bucles y Procesamiento de Listas**
   - Diferencias entre `Loop Over Items` y `Split in Batches`.
   - Patrones de iteración.
2. **Agregación de Datos**
   - Cómo unir ramas separadas.
   - Uso del nodo `Code` para reducir arrays.
3. **Control de Velocidad (Rate Limiting)**
   - Evitar errores 429 en APIs externas.
   - Uso del nodo `Wait` y `Split in Batches`.

## Conceptos Clave

### Loop Over Items vs Split in Batches
| Característica | Loop Over Items (Nuevo) | Split in Batches (Clásico) |
| :--- | :--- | :--- |
| **Uso Principal** | Iterar sobre cada ítem individualmente. | Procesar grupos de ítems (lotes). |
| **Complejidad** | Baja. Maneja el contexto automáticamente. | Media. Requiere gestionar el loop manualmente. |
| **Memoria** | Eficiente. | Puede consumir más si no se resetea. |
| **Caso de Uso** | "Para cada email, enviar una respuesta". | "Enviar 100 emails cada hora". |

### Agregación (Merge vs Code)
A menudo, después de un bucle, necesitas volver a tener una sola lista.
- **Merge (Append):** Une los resultados, pero a veces duplica estructuras.
- **Code Node:** La forma más limpia de hacer un `reduce` o `map` final.

```javascript
// Ejemplo de agregación manual en nodo Code
const allItems = $items("NombreDelNodoAnterior");
return [{
  json: {
    resumen: allItems.map(i => i.json.id),
    total: allItems.length
  }
}];
```
