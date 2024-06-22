import type { ValidationChecks } from 'langium';
import type { SelLanguageAstType } from './generated/ast.js';
import type { SelLanguageServices } from './sel-language-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SelLanguageServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SelLanguageValidator;
    const checks: ValidationChecks<SelLanguageAstType> = {
    //    Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SelLanguageValidator {

    // checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
    //     if (person.name) {
    //         const firstChar = person.name.substring(0, 1);
    //         if (firstChar.toUpperCase() !== firstChar) {
    //             accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
    //         }
    //     }
    // }

}
