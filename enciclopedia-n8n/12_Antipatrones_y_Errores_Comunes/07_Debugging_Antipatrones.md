# Debugging de Antipatrones en n8n

## Introducción

El debugging efectivo de antipatrones en n8n requiere un enfoque sistemático y herramientas especializadas. Este documento proporciona técnicas y estrategias para identificar, analizar y resolver antipatrones en workflows.

## 1. Técnicas de Identificación

### Análisis Estático
Herramientas y técnicas para identificar antipatrones sin ejecutar el código.

```javascript
// Analizador de complejidad ciclomática
function analyzeComplexity(code) {
  const patterns = {
    conditionals: /(if|switch|while|for|catch)/g,
    returns: /return\s+/g,
    logicalOperators: /(\&\&|\|\|)/g
  };

  let complexity = 1;
  
  Object.values(patterns).forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  });

  return {
    complexity,
    isComplex: complexity > 10,
    recommendation: complexity > 10 
      ? 'Consider refactoring into smaller functions'
      : 'Complexity is acceptable'
  };
}

// Detector de código duplicado
class DuplicateDetector {
  constructor(threshold = 0.8) {
    this.threshold = threshold;
    this.sequences = new Map();
  }

  analyze(code) {
    const lines = code.split('\n');
    const duplicates = [];
    
    for (let i = 0; i < lines.length - 3; i++) {
      const sequence = lines.slice(i, i + 3).join('\n');
      
      if (this.sequences.has(sequence)) {
        duplicates.push({
          firstOccurrence: this.sequences.get(sequence),
          secondOccurrence: i,
          code: sequence
        });
      } else {
        this.sequences.set(sequence, i);
      }
    }
    
    return duplicates;
  }
}
```

## 2. Estrategias de Resolución

### Logging Estructurado
Implementación de logging avanzado para tracking y debugging.

```javascript
class StructuredLogger {
  constructor(options = {}) {
    this.context = options.context || {};
    this.minimumLevel = options.minimumLevel || 'info';
    
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  log(level, message, data = {}) {
    if (this.levels[level] < this.levels[this.minimumLevel]) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context: this.context,
      workflow: {
        id: $workflow.id,
        name: $workflow.name
      },
      execution: {
        id: $execution.id,
        mode: $execution.mode
      }
    };

    console[level](JSON.stringify(logEntry));
  }

  withContext(additionalContext) {
    return new StructuredLogger({
      ...this.options,
      context: {
        ...this.context,
        ...additionalContext
      }
    });
  }
}

// Uso del logger
const logger = new StructuredLogger({
  context: { service: 'UserProcessor' },
  minimumLevel: 'debug'
});

logger.log('info', 'Processing user data', { userId: 123 });
```

### Performance Profiling
Herramientas para identificar cuellos de botella y problemas de rendimiento.

```javascript
class PerformanceProfiler {
  constructor() {
    this.measurements = new Map();
    this.ongoing = new Map();
  }

  start(operation) {
    this.ongoing.set(operation, {
      startTime: process.hrtime.bigint(),
      memory: process.memoryUsage()
    });
  }

  end(operation) {
    const start = this.ongoing.get(operation);
    if (!start) return;

    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    const duration = Number(endTime - start.startTime) / 1e6; // ms
    const memoryDelta = {
      heapUsed: endMemory.heapUsed - start.memory.heapUsed,
      heapTotal: endMemory.heapTotal - start.memory.heapTotal,
      external: endMemory.external - start.memory.external
    };

    this.measurements.set(operation, {
      duration,
      memoryDelta,
      timestamp: new Date()
    });

    this.ongoing.delete(operation);
  }

  getReport() {
    const report = {
      operations: {},
      summary: {
        totalOperations: this.measurements.size,
        totalDuration: 0,
        maxMemoryUsage: 0
      }
    };

    for (const [op, data] of this.measurements) {
      report.operations[op] = data;
      report.summary.totalDuration += data.duration;
      report.summary.maxMemoryUsage = Math.max(
        report.summary.maxMemoryUsage,
        data.memoryDelta.heapUsed
      );
    }

    return report;
  }
}
```

## 3. Métodos de Prevención

### Code Review Automatizado
Implementación de checks automáticos para prevenir antipatrones.

```javascript
class CodeReviewer {
  constructor() {
    this.rules = new Map([
      ['noHardcodedCredentials', this.checkCredentials],
      ['complexityCheck', this.checkComplexity],
      ['errorHandlingCheck', this.checkErrorHandling]
    ]);
  }

  async review(code) {
    const issues = [];
    
    for (const [ruleName, check] of this.rules) {
      try {
        const ruleIssues = await check(code);
        issues.push(...ruleIssues.map(issue => ({
          rule: ruleName,
          ...issue
        })));
      } catch (error) {
        console.error(`Error checking rule ${ruleName}:`, error);
      }
    }
    
    return {
      issues,
      summary: this.summarizeIssues(issues)
    };
  }

  summarizeIssues(issues) {
    return {
      total: issues.length,
      byRule: issues.reduce((acc, issue) => {
        acc[issue.rule] = (acc[issue.rule] || 0) + 1;
        return acc;
      }, {})
    };
  }

  async checkCredentials(code) {
    const patterns = [
      /password\s*=\s*['"][^'"]+['"]/i,
      /api[_\s]?key\s*=\s*['"][^'"]+['"]/i,
      /token\s*=\s*['"][^'"]+['"]/i
    ];

    return patterns
      .flatMap(pattern => {
        const matches = code.match(pattern) || [];
        return matches.map(match => ({
          type: 'security',
          severity: 'high',
          message: 'Hardcoded credential detected',
          line: this.findLineNumber(code, match)
        }));
      });
  }
}
```

## Mejores Prácticas

1. **Monitoreo Proactivo**
   - Implementar health checks
   - Configurar alertas
   - Monitorear métricas clave

2. **Testing Sistemático**
   - Unit tests comprehensivos
   - Integration tests
   - Performance testing

3. **Documentación**
   - Mantener logs de cambios
   - Documentar fixes
   - Compartir learnings

## Herramientas y Recursos

### Debugging
- Chrome DevTools
- Node.js --inspect
- Visual Studio Code Debugger

### Profiling
- Node.js Profiler
- Clinic.js
- Performance Timeline API

## Referencias

1. [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
2. [n8n Troubleshooting](https://docs.n8n.io/reference/trouble-shooting/)
3. [JavaScript Debugging Patterns](https://addyosmani.com/blog/essential-js-namespacing/)
