import { NodeFileSystem } from 'langium/node';
import { Def, Expr, isBinExpr, isColor, isFor, isGroup, isLit, isMacro, isMove, isNegExpr, isPen, isRef, type Model, type Stmt } from '../language/generated/ast.js';
import { createMiniLogoServices } from '../language/hello-world-module.js';
// import { expandToNode, joinToNode, toString } from 'langium/generate';
// import * as fs from 'node:fs';
// import * as path from 'node:path';
// import { extractDestinationAndName } from './cli-util.js';

export function generateJSON(model: Model) : string {
    const services = createMiniLogoServices(NodeFileSystem).MiniLogo;
    const json = services.serializer.JsonSerializer.serialize(model, { space: 1 });
    return json;
}

type GeneratedObject = Pen | Move | Color;

export function generateCommands(model: Model) : string {
    const env: MiniLogGenEnv = new Map<string, number>;
    const result: GeneratedObject[] = generateStatements(model.stmts, env);
    return JSON.stringify(result);
}


type MiniLogGenEnv = Map<string, number>;


type Pen = { 
    cmd: 'penUp' | 'penDown'
}

type Move = {
    cmd: 'move'
    x: number
    y: number
}
type Color = {
    cmd: 'color'
    color: string
}

function generateStatements(stmts: Stmt[], env: MiniLogGenEnv): GeneratedObject[] {
    const generated : GeneratedObject[] = [];
    for (const stmt of stmts) {
        if (isPen(stmt)) generated.push({ cmd: stmt.mode === 'up' ? 'penUp' : 'penDown'})
        else if (isMove(stmt)) generated.push({cmd: 'move', x: evaluateExpression(stmt.ex, env), y: evaluateExpression(stmt.ey, env) })
        else if (isMacro(stmt)) {
            const macro: Def = stmt.def.ref as Def;
            let macroEnv = new Map(env);
            let tmpEnv = new Map<string, number>();
            macro.params.map((elm, idx: number) => tmpEnv.set(elm.name, evaluateExpression(stmt.args[idx], macroEnv)));
            tmpEnv.forEach((v,k) => macroEnv.set(k,v));
            generated.push(... generateStatements(macro.body, env));
        } else if (isFor(stmt)) {
            let i = evaluateExpression(stmt.e1, env);
            let end = evaluateExpression(stmt.e2, env);
            let results : GeneratedObject[] = [];
            const loopEnv = new Map(env);
            while (i < end) {
                loopEnv.set(stmt.var.name, i++);
                results = results.concat(... generateStatements(stmt.body, new Map(loopEnv)));
            }
            generated.push(... results);
        } else if (isColor(stmt)) {
            generated.push({cmd:'color', color: stmt.color!});
        } else {
            throw new Error("Bad tree.");
        }
    }
    return generated;
}


function evaluateExpression(e: Expr, env: MiniLogGenEnv): number {
    if (isLit(e)) {
        return e.val;
    } else if(isRef(e)) {
        return env.get(e.val.ref?.name ?? '')!;
    } else if(isBinExpr(e)) {
        let v1 = evaluateExpression(e.e1, env);
        let v2 = evaluateExpression(e.e2, env);
        switch(e.op) {
            case '+': return v1 + v2;
            case '-': return v1 - v2;
            case '*': return v1 * v2;
            case '/': return v1 / v2;
            default: throw new Error("Invalid operation.");
        }
    } else if(isNegExpr(e)) {
        return -evaluateExpression(e.ne, env);
    } else if(isGroup(e)) {
        return evaluateExpression(e.ge, env);
    } else {
        throw new Error("Unknown expression type.");
    }
}


// export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
//     const data = extractDestinationAndName(filePath, destination);
//     const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

//     const fileNode = expandToNode`
//         "use strict";

//         ${joinToNode(model.defs, def => `console.log('Statement: ${def.name}!');`, { appendNewLineIfNotEmpty: true })}
//     `.appendNewLineIfNotEmpty();

//     if (!fs.existsSync(data.destination)) {
//         fs.mkdirSync(data.destination, { recursive: true });
//     }
//     fs.writeFileSync(generatedFilePath, toString(fileNode));
//     return generatedFilePath;
// }
