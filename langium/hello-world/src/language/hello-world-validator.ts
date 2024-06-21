import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { MiniLogoAstType, Model, Def } from './generated/ast.js';
import type { MiniLogoServices } from './hello-world-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: MiniLogoServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.MiniLogoValidator;
    const checks: ValidationChecks<MiniLogoAstType> = {
        Model: validator.checkModel,
        Def: validator.checkDef
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class HelloWorldValidator {
    checkModel(model: Model, accept: ValidationAcceptor): void {
        const defs = model.defs;
        const previousNames = new Set<string>();
        for (const def of defs) {
            if (previousNames.has(def.name.toLowerCase())) {
                accept('warning', 'Duplicate definition.', { node: def, property: 'name' });
            } else {
                previousNames.add(def.name.toLowerCase());
            }
        }        
    }
    checkDef(def: Def, accept: ValidationAcceptor): void {
        const params = def.params;
        const previousNames = new Set<string>();
        for (const param of params) {
            if (previousNames.has(param.name.toLowerCase())) {
                accept('warning', `Duplicate parameter name '${param.name}'.`, { node: param, property: 'name' });
            } else {
                previousNames.add(param.name.toLowerCase());
            }
        }        
    }
}
