# 📜 Cheat Sheet: Expresiones JavaScript en n8n

Referencia rápida para las manipulaciones de datos más comunes.

## Fechas (Luxon)
n8n usa la librería `luxon` (disponible como `DateTime`).

| Acción | Código |
| :--- | :--- |
| **Fecha Actual** | `{{ $now }}` |
| **Formato ISO** | `{{ $now.toISO() }}` |
| **Formato Humano** | `{{ $now.toFormat('dd/MM/yyyy') }}` |
| **Ayer** | `{{ $now.minus({ days: 1 }) }}` |
| **Mañana** | `{{ $now.plus({ days: 1 }) }}` |
| **Zona Horaria** | `{{ $now.setZone('America/New_York') }}` |
| **Diferencia** | `{{ $now.diff(otherDate, 'days').toObject().days }}` |

## Strings (Texto)

| Acción | Código |
| :--- | :--- |
| **Mayúsculas** | `{{ $json.texto.toUpperCase() }}` |
| **Reemplazar** | `{{ $json.texto.replace('viejo', 'nuevo') }}` |
| **Cortar** | `{{ $json.texto.slice(0, 10) }}` |
| **Contiene?** | `{{ $json.texto.includes('error') }}` |
| **Limpiar espacios** | `{{ $json.texto.trim() }}` |

## Arrays (Listas)

| Acción | Código |
| :--- | :--- |
| **Longitud** | `{{ $json.lista.length }}` |
| **Primer ítem** | `{{ $json.lista[0] }}` |
| **Último ítem** | `{{ $json.lista.at(-1) }}` |
| **Unir (Join)** | `{{ $json.lista.join(', ') }}` |
| **Filtrar** | `{{ $json.lista.filter(x => x > 10) }}` |
| **Map (Transformar)** | `{{ $json.lista.map(x => x.nombre) }}` |

## Lógica Condicional (Ternario)
Útil para valores por defecto.
```javascript
{{ $json.valor ? $json.valor : 'Valor por defecto' }}
```
O más corto:
```javascript
{{ $json.valor || 'Valor por defecto' }}
```
