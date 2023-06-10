import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { getConfig } from './configManager.js';
import { getLastLine } from './getLastLine.js';


export function getDictionary() {
    const usernameList = readFileSync(getConfig().dictionary_path, 'utf8')
        .replace(/ \| .*/g, '')
        .replace(/\r/gi, '')
        .trim()
        .toLowerCase()
        .split(/\s+/)

    return usernameList
}

export function getDictionaryIndex() {

    // get last line in invalid.txt
    const invalidLastLine = getLastLine('invalid')

    // get last line in valid.txt
    const validLastLine = getLastLine('valid')

    // check if there is last line for both invalid.txt & valid.txt
    if (!invalidLastLine && !validLastLine) return 0

    // if there is find index of the last line in dictionary
    const usernameList = getDictionary()
    let invalidIndex = usernameList.findIndex(username => username === invalidLastLine)
    let validIndex = usernameList.findIndex(username => username === validLastLine)

    invalidIndex = invalidIndex === -1 ? 0 : invalidIndex
    validIndex = validIndex === -1 ? 0 : validIndex

    // if the index of invalid.txt is greater than the index of valid.txt that is the currentIndex
    if (invalidIndex >= validIndex) {
        console.log('Resuming at:', chalk.green(usernameList[invalidIndex + 1]));
        return invalidIndex + 1
    }

    if (validIndex >= invalidIndex) {
        console.log('Resuming at:', chalk.green(usernameList[validIndex + 1]));
        return validIndex + 1
    }

    return 0
}