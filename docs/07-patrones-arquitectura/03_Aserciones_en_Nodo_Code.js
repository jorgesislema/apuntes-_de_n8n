// Ejemplo de aserciones en un nodo Code para validar resultados intermedios
if (items[0].json.resultado !== 'esperado') {
  throw new Error('El resultado no es el esperado');
}
