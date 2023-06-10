
import 'dotenv/config';

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import Bot from './checker.js';
import { getDictionary, getDictionaryIndex, } from './utils/getDictionary.js';
import { getTokens } from './utils/getTokens.js';
import { askToken } from './utils/prompts/askCredentials.js';
import { askDictionary } from './utils/prompts/askDictionary.js';
import { askWebHook } from './utils/prompts/askWebhook.js';
import { sleep } from './utils/sleep.js';
import { updateTitle } from './utils/updateTitle.js';

async function init() {
    const title = `Discord Username Checker`
    updateTitle(title)

    const rainbowTitle = chalkAnimation.rainbow('Discord Username Checker - created by smethz')

    await sleep(1500)
    rainbowTitle.stop()
}

await init()

// Check if tokens exists
const tokenList = getTokens()
if (!tokenList || tokenList.length) {
    await askToken()
}

// Ask for Dictionary
await askDictionary()

await askWebHook()

// Start checker
const usernameList = getDictionary()
export let currentIndex = getDictionaryIndex()
for (currentIndex; currentIndex <= usernameList.length; currentIndex++) {
    if (currentIndex >= usernameList.length) {
        console.log(chalk.green('FINISHED CHECKING USERNAMES!'))
        process.exit(1);
    }

    try {
        await Bot.check(usernameList[currentIndex]);
    } catch (e) {
        console.log(e)
    }
}