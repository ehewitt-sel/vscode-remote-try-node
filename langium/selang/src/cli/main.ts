import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { SelLanguageLanguageMetaData } from '../language/generated/module.js';
import { createSelLanguageServices } from '../language/sel-language-module.js';
import { extractAstNode } from './cli-util.js';
import { generate, test } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createSelLanguageServices(NodeFileSystem).SelLanguage;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generate(model, fileName, opts.destination);
    console.log(chalk.green(`${generatedFilePath}`));
};

export const testAction = async (fileNames: string[]): Promise<void> => {
    test(fileNames);
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = SelLanguageLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program
        .command('test')
        .argument('[file...]', `Source files, or * for all`)
        .description('Verify generated model matches expected.')
        .action(testAction);
    program.parse(process.argv);
}
