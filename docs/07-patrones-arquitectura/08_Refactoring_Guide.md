# Guía de Refactorización en n8n

## Introducción

La refactorización sistemática es esencial para mantener workflows de n8n mantenibles y eficientes. Esta guía proporciona estrategias y patrones para refactorizar código existente y mejorar su calidad.

## 1. Técnicas de Mejora de Código

### Extracción de Funciones
Separar código en funciones reutilizables y bien definidas.

```javascript
// Antes: Código monolítico
function processUserData(userData) {
  // Validación
  if (!userData.email || !userData.name) {
    throw new Error('Invalid user data');
  }
  
  // Transformación
  const processedData = {
    email: userData.email.toLowerCase(),
    name: userData.name.trim(),
    createdAt: new Date()
  };
  
  // Logging
  console.log('Processing user:', processedData);
  
  return processedData;
}

// Después: Funciones extraídas
class UserProcessor {
  validateUser(userData) {
    const required = ['email', 'name'];
    const missing = required.filter(field => !userData[field]);
    
    if (missing.length > 0) {
      throw new ValidationError(
        `Missing required fields: ${missing.join(', ')}`
      );
    }
  }

  normalizeUser(userData) {
    return {
      email: userData.email.toLowerCase(),
      name: userData.name.trim(),
      createdAt: new Date()
    };
  }

  async process(userData) {
    this.validateUser(userData);
    const normalized = this.normalizeUser(userData);
    await this.logProcessing(normalized);
    return normalized;
  }

  async logProcessing(data) {
    await logger.info('Processing user', { data });
  }
}
```

## 2. Estrategias de Migración

### Refactorización Incremental
Proceso gradual de mejora manteniendo la funcionalidad.

```javascript
class WorkflowMigrator {
  constructor(options = {}) {
    this.backupEnabled = options.backup ?? true;
    this.validateSteps = options.validate ?? true;
    this.logger = options.logger || console;
  }

  async migrateWorkflow(workflowId) {
    try {
      // 1. Backup
      if (this.backupEnabled) {
        await this.backupWorkflow(workflowId);
      }

      // 2. Análisis
      const workflow = await this.analyzeWorkflow(workflowId);
      
      // 3. Planificación
      const migrationPlan = this.createMigrationPlan(workflow);
      
      // 4. Ejecución por fases
      for (const phase of migrationPlan) {
        await this.executePhase(phase);
        
        if (this.validateSteps) {
          await this.validatePhase(phase);
        }
      }

      // 5. Verificación final
      await this.verifyMigration(workflowId);
      
      return { success: true, workflowId };
    } catch (error) {
      await this.handleMigrationError(error, workflowId);
      throw error;
    }
  }

  async backupWorkflow(workflowId) {
    const backup = {
      timestamp: new Date(),
      workflow: await this.getWorkflow(workflowId)
    };
    
    await this.saveBackup(backup);
    this.logger.info('Backup created', { workflowId });
  }

  createMigrationPlan(workflow) {
    return [
      {
        phase: 'structure',
        tasks: this.planStructuralChanges(workflow)
      },
      {
        phase: 'nodes',
        tasks: this.planNodeUpdates(workflow)
      },
      {
        phase: 'connections',
        tasks: this.planConnectionUpdates(workflow)
      }
    ];
  }

  async executePhase(phase) {
    this.logger.info(`Executing phase: ${phase.phase}`);
    
    for (const task of phase.tasks) {
      await this.executeTask(task);
    }
  }

  async validatePhase(phase) {
    const validation = await this.runValidation(phase);
    
    if (!validation.success) {
      throw new Error(
        `Validation failed for phase ${phase.phase}: ${validation.errors}`
      );
    }
  }
}
```

## 3. Mejores Prácticas

### Patrones de Refactorización
Implementación de patrones de diseño comunes.

```javascript
// Implementación del patrón Strategy
class DataProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  async process(data) {
    return await this.strategy.process(data);
  }
}

class JsonStrategy {
  async process(data) {
    return {
      type: 'json',
      processed: JSON.stringify(data)
    };
  }
}

class XmlStrategy {
  async process(data) {
    return {
      type: 'xml',
      processed: this.convertToXml(data)
    };
  }
}

// Implementación del patrón Observer
class WorkflowEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const callback of this.listeners.get(event)) {
        callback(data);
      }
    }
  }
}
```

## 4. Testing Durante Refactorización

### Estrategias de Testing
Mantener y expandir cobertura de tests durante refactorización.

```javascript
// Test Framework Setup
class WorkflowTestSuite {
  constructor(workflow) {
    this.workflow = workflow;
    this.tests = new Map();
    this.beforeEach = [];
    this.afterEach = [];
  }

  addTest(name, testFn) {
    this.tests.set(name, testFn);
  }

  beforeEachTest(fn) {
    this.beforeEach.push(fn);
  }

  afterEachTest(fn) {
    this.afterEach.push(fn);
  }

  async runTests() {
    const results = {
      total: this.tests.size,
      passed: 0,
      failed: 0,
      tests: {}
    };

    for (const [name, test] of this.tests) {
      try {
        // Setup
        for (const setup of this.beforeEach) {
          await setup();
        }

        // Test
        await test();
        
        results.passed++;
        results.tests[name] = { status: 'passed' };

        // Teardown
        for (const teardown of this.afterEach) {
          await teardown();
        }
      } catch (error) {
        results.failed++;
        results.tests[name] = {
          status: 'failed',
          error: error.message
        };
      }
    }

    return results;
  }
}

// Ejemplo de uso
const suite = new WorkflowTestSuite(workflow);

suite.beforeEachTest(async () => {
  await cleanTestData();
});

suite.addTest('should process user data', async () => {
  const processor = new UserProcessor();
  const result = await processor.process({
    name: 'Test User',
    email: 'test@example.com'
  });
  
  assert.strictEqual(result.email, 'test@example.com');
});

const results = await suite.runTests();
```

## Herramientas y Recursos

### Análisis de Código
- ESLint para static analysis
- SonarQube para quality gates
- Code Climate para technical debt

### Testing
- Jest para unit testing
- Mocha para integration tests
- Sinon para mocking

### Monitoreo
- New Relic para APM
- Datadog para metrics
- Sentry para error tracking

## Referencias

1. [Refactoring - Martin Fowler](https://refactoring.com/)
2. [n8n Development Guide](https://docs.n8n.io/integrations/creating-nodes/)
3. [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
