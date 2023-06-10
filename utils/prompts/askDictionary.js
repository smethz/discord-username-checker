import inquirer from "inquirer";
import InquirerFuzzyPath from "inquirer-fuzzy-path";
import { updateConfig } from "../configManager.js";
import { createOutputDirectory } from "../createOutputDirectory.js";

inquirer.registerPrompt('fuzzypath', InquirerFuzzyPath)

export async function askDictionary() {
    const dictionaryFilepathAnswer = await inquirer.prompt([
        {
            type: 'fuzzypath',
            name: 'path',
            excludePath: nodePath => nodePath.startsWith('node_modules'),
            excludeFilter: nodePath => nodePath == '.' || !nodePath.endsWith('.txt'),
            itemType: 'file',
            rootPath: './',
            message: 'Select the list that you want to check (.txt):',
            suggestOnly: false,
            depthLimit: 3,
        }
    ]);

    // Check resumability
    const dictionaryPath = Object.values(dictionaryFilepathAnswer)[0]
    const filenameRegex = /([^\\/]+)(?=\.txt$)/g
    const dictionaryFilename = dictionaryPath.match(filenameRegex)

    await updateConfig('dictionary_path', dictionaryPath)
    await updateConfig('output_path', `output/${dictionaryFilename}/`)

    createOutputDirectory('invalid')
    createOutputDirectory('valid')
}