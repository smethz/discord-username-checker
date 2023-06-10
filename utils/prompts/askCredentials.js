import inquirer from "inquirer";
import { updateConfig } from "../configManager.js";

// export async function askToken() {
//     const tokenAnswer = await inquirer.prompt({
//         name: 'token',
//         type: "password",
//         mask: '*',
//         message: 'Input your Discord Token:',
//         validate: (token) => {
//             const validTokenRegex = /[a-z0-9A-Z]{20, 30}\.[a-z0-9A-Z]{4, 10}\.[a-z0-9A-Z]{30, 50}/
//             if (!token.match(validTokenRegex)) return `The token you provided is invalid.`
//             return true
//         }
//     })

//     const tokenValue = Object.values(tokenAnswer)[0]

//     await updateEnv('TOKEN', tokenValue)
// }

export async function askToken() {
    const dictionaryFilepathAnswer = await inquirer.prompt([
        {
            type: 'fuzzypath',
            name: 'path',
            excludePath: nodePath => nodePath.startsWith('node_modules'),
            excludeFilter: nodePath => nodePath == '.' || !nodePath.endsWith('.txt'),
            itemType: 'file',
            rootPath: './',
            message: 'Select the tokens list (.txt):',
            suggestOnly: false,
            depthLimit: 2,
        }
    ]);

    const tokensPath = Object.values(dictionaryFilepathAnswer)[0]


    await updateConfig('tokens_path', tokensPath)
}