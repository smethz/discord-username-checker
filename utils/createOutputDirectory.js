import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { getConfig } from './configManager.js';

export function createOutputDirectory(fileName) {
    const config = getConfig()

    if (!existsSync(`${config.output_path}${fileName}.txt`)) {

        if (!existsSync(config.output_path)) {
            mkdirSync(config.output_path, { recursive: true });
            console.log('Output directory created successfully.');
        }

        writeFileSync(`${config.output_path}${fileName}.txt`, '', 'utf8');
    }
}