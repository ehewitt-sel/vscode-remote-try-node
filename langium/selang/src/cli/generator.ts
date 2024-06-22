import { NodeFileSystem } from 'langium/node';
import { Model } from '../language/generated/ast.js';
import { createSelLanguageServices } from '../language/sel-language-module.js';
import { extractAstNode } from './cli-util.js';

// import { expandToNode, joinToNode, toString } from 'langium/generate';
// import * as fs from 'node:fs';
// import * as path from 'node:path';
// import { extractDestinationAndName } from './cli-util.js';

export function generate(model: Model, filePath: string, destination: string | undefined): string {
    const services = createSelLanguageServices(NodeFileSystem).SelLanguage;
    model.expected = undefined;
    const json = services.serializer.JsonSerializer.serialize(model/*, { space: 1 }*/);
    return json;
    // const data = extractDestinationAndName(filePath, destination);
    // const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    // const fileNode = expandToNode`
    //     "use strict";

    //     ${joinToNode(model.greetings, greeting => `console.log('Hello, ${greeting.person.ref?.name}!');`, { appendNewLineIfNotEmpty: true })}
    // `.appendNewLineIfNotEmpty();

    // if (!fs.existsSync(data.destination)) {
    //     fs.mkdirSync(data.destination, { recursive: true });
    // }
    // fs.writeFileSync(generatedFilePath, toString(fileNode));
    // return generatedFilePath;
}

export async function test(filePaths: string[]) {
    for (var file of filePaths) {
        console.log(file);
        const services = createSelLanguageServices(NodeFileSystem).SelLanguage;    
        var model = await extractAstNode<Model>(file, services);        
        const expected = model.expected?.json.substring(3);
        model.expected = undefined;
        const json = services.serializer.JsonSerializer.serialize(model/*, { space: 1 }*/);
        if (json !== expected) {
            console.log(": Expected: " + expected);
            console.log("Actual: " + json);
        }
    }

    // const data = extractDestinationAndName(filePath, destination);
    // const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    // const fileNode = expandToNode`
    //     "use strict";

    //     ${joinToNode(model.greetings, greeting => `console.log('Hello, ${greeting.person.ref?.name}!');`, { appendNewLineIfNotEmpty: true })}
    // `.appendNewLineIfNotEmpty();

    // if (!fs.existsSync(data.destination)) {
    //     fs.mkdirSync(data.destination, { recursive: true });
    // }
    // fs.writeFileSync(generatedFilePath, toString(fileNode));
    // return generatedFilePath;
}
