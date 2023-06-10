import { readFileSync } from 'node:fs';
import { getConfig } from './configManager.js';

export function getLastLine(filename) {
    const filePath = `${getConfig().output_path}${filename}.txt`

    const lines = readFileSync(filePath, 'utf8')
        .replace(/ \| .*/g, '')
        .replace(/\r/gi, '')
        .trim()
        .toLowerCase()
        .split(/\s+/)

    const lastLine = lines[lines.length - 1]

    return lastLine
}