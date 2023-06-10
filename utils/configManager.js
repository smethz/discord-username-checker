import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export function getConfig() {
    return JSON.parse(readFileSync('./config.json'))
}

export async function updateConfig(configKey, configValue) {
    const fileName = './config.json';
    const file = getConfig()

    file[configKey] = configValue;

    writeFileSync(fileName, JSON.stringify(file), function writeJSON(err) {
        if (err) return console.log(err);

    });
}

export async function updateEnv(variableName, variableValue) {
    const envFilePath = '.env'

    // No .env file create one
    if (!existsSync(envFilePath)) {
        writeFileSync(envFilePath, `${variableName}=${variableValue}`);
    }

    const envFileContent = readFileSync(envFilePath, 'utf8');


    // Construct the regular expression pattern to match the variable
    const pattern = new RegExp(`^${variableName}=.*$`, 'gm');

    // Modify the environment variable value
    const envNameExists = envFileContent.includes(`${variableName}=`)
    let modifiedEnvFileContent = envFileContent
    if (envNameExists) {
        modifiedEnvFileContent = envFileContent.replace(pattern, `${variableName}=${variableValue}`);
    } else {
        modifiedEnvFileContent = envFileContent + `\n` + `${variableName}=${variableValue}`
    }

    // Write the modified content back to the environment file
    writeFileSync(envFilePath, modifiedEnvFileContent);

}