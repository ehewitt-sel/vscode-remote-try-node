// import { MonacoEditorLanguageClientWrapper, UserConfig } from "monaco-editor-wrapper/bundle";
// import { buildWorkerDefinition } from "monaco-editor-workers";
// //import { addMonacoStyles } from 'monaco-editor-wrapper/styles';

// /**
//  * Setup Monaco's own workers and also incorporate the necessary styles for the monaco-editor
//  */
// function setup() {
//     buildWorkerDefinition(
//         './monaco-editor-workers/workers',
//         new URL('', window.location.href).href,
//         false
//     );
//     //addMonacoStyles('monaco-editor-styles');
// }

// function getMonarchGrammar() {
// return {
//     keywords: [
        
//     ],
//     operators: [
//         '*','+','-','/',':='
//     ],
//     symbols: /\(|\)|\*|\+|-|\/|:=|\[|\]/,

//     tokenizer: {
//         initial: [
//             { regex: /SIN|COS/, action: {"token":"FUNC"} },
//             { regex: /[nct]/, action: {"token":"IND"} },
//             { regex: /[_a-zA-Z][\w_]*/, action: {"token":"ID"} },
//             { regex: /[0-9]+/, action: {"token":"number"} },
//             { regex: /\/\/=([^\n\r]+)/, action: {"token":"string"} },
//             { include: '@whitespace' },
//             { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
//         ],
//         whitespace: [
//             { regex: /\s+/, action: {"token":"white"} },
//             { regex: /\/\/[^\n\r]*/, action: {"token":"comment"} },
//         ],
//         comment: [
//         ],
//     }
// }};

// /**
//  * Retrieves the program code to display, either a default or from local storage
//  */
// function getMainCode() {
//     let mainCode = `
//     IA[x] = SIN(x)
//     `;
    
//     // optionally: use local storage to save the code
//     // and seek to restore any previous code from our last session
//     if (window.localStorage) {
//         const storedCode = window.localStorage.getItem('mainCode');
//         if (storedCode !== null) {
//             mainCode = storedCode;
//         }
//     }

//     return mainCode;
// }

// /**
//  * Creates & returns a fresh worker using the MiniLogo language server
//  */
// function getWorker() {
//     const workerURL = new URL('selang-server-worker.js', window.location.href);
//     return new Worker(workerURL.href, {
//         type: 'module',
//         name: 'SELangLS'
//     });
// }

// type WorkerUrl = string;

// /**
//  * Classic configuration for the monaco editor (for use with a Monarch grammar)
//  */
// interface ClassicConfig {
//     code: string,
//     htmlElement: HTMLElement,
//     languageId: string,
//     worker: WorkerUrl | Worker,
//     monarchGrammar: any;
// }

// /**
//  * Generates a valid UserConfig for a given Langium example
//  * 
//  * @param config An extended or classic editor config to generate a UserConfig from
//  * @returns A completed UserConfig
//  */
// function createUserConfig(config: ClassicConfig): UserConfig {
//     // setup urls for config & grammar
//     const id = config.languageId;

//     // generate langium config
//     return {
//         htmlElement: config.htmlElement,
//         wrapperConfig: {
//             editorAppConfig: {
//                 $type: 'classic',
//                 languageId: id,
//                 useDiffEditor: false,
//                 code: config.code,
//                 theme: 'vs-dark',
//                 languageDef: config.monarchGrammar
//             },
//             serviceConfig: {
//                 enableModelService: true,
//                 configureConfigurationService: {
//                     defaultWorkspaceUri: '/tmp/'
//                 },
//                 enableKeybindingsService: true,
//                 enableLanguagesService: true,
//                 debugLogging: false
//             }
//         },
//         languageClientConfig: {
//             options: {
//                 $type: 'WorkerDirect',
//                 worker: config.worker as Worker,
//                 name: `${id}-language-server-worker`
//             }
//         }
//     };
// }

// // create a wrapper instance
// const wrapper = new MonacoEditorLanguageClientWrapper();

// // start up with a user config
// await wrapper.start(createUserConfig({
//     htmlElement: document.getElementById("monaco-editor-root")!,
//     languageId: 'minilogo',
//     code: getMainCode(),
//     worker: getWorker(),
//     monarchGrammar: getMonarchGrammar()
// }));
