import axios from 'axios';
import axiosRetry from 'axios-retry';
import chalk from 'chalk';
import { appendFile } from 'fs';
import { currentIndex } from './index.js';
import { getConfig } from './utils/configManager.js';
import { getDictionary, } from './utils/getDictionary.js';
import { getToken } from './utils/getTokens.js';
import { sendWebhook } from './utils/sendWebhook.js';
import { updateTitle } from './utils/updateTitle.js';

let invalidNames = [];
let validNames = [];

const pomeloApi = axios.create()

axiosRetry(pomeloApi, {
    retries: 1,
    retryDelay: (_, error) => {
        if (error.response.status === 429) {
            // Parse the Retry-After value (either a number or a date string)
            const retryAfter = error.response.data.retry_after * 1000

            // Use the retryAfter if it's a positive number
            if (retryAfter > 0) {
                return retryAfter + 10;
            }
        }

        // Fallback to a default delay - 3secs
        return 3000
    },
    retryCondition: (error) => {
        return error.response.status === 429;
    }
})

pomeloApi.interceptors.request.use(request => {
    request.headers['authorization'] = getToken()
})

const pomelo_attempt = 'https://discord.com/api/v9/users/@me/pomelo-attempt'
const endpoint = 'https://discord.com/api/v9/users/@me'

class UsernameChecker {
    constructor(username) {
        this.username = username
    }

    async check() {

        const data = await pomeloApi.patch(endpoint, { username: this.username }, {
            // const data = await pomeloApi.post(pomelo_attempt, { username: this.username }, {
            headers: {
                "content-type": "application/json",
            }
        })
            .then(response => response?.data)
            .catch(err => err.response?.data)


        let textLog = '';
        const config = getConfig()


        // Valid username
        if (data?.captcha_key || (data?.errors && !data?.errors?.username)) {
            validNames.push(this.username)
            appendFile(`${config.output_path}/valid.txt`, `${this.username}\n`, { flag: 'a+' }, (err) => {
                if (err) throw err;
            });

            sendWebhook(this.username)

            textLog += chalk.green(this.username)
            textLog += chalk.blue(" | ");
            textLog += chalk.green(`VALID USERNAME FOUND`);
        } else {
            const error = data?.errors?.username?._errors[0]?.code || 'Unknown Error Occurred'
            if (error === 'Unknown Error Occurred') console.log(data)

            invalidNames.push(this.username)
            appendFile(`${config.output_path}invalid.txt`, `${this.username} | ${error}\n`, { flag: 'a+' }, (err) => {
                if (err) throw err;
            });

            textLog += this.username
            textLog += chalk.blue(" | ");
            textLog += error !== 'Unknown Error Occurred' ? chalk.red(error) : chalk.yellow(error);
        }

        const title = `${config.output_path} | Valid: ${validNames.length} | Invalid: ${invalidNames.length} `;
        log(textLog, title);
    }
}

function log(text, title) {
    console.log(text);
    const usernameList = getDictionary()
    title = `Discord Username Checker - ${title} | Remaining: ${usernameList.length - (currentIndex + 1)} | Total: ${usernameList.length} `;

    updateTitle(title)
}

const Bot = {
    check: async function (username) {
        await new UsernameChecker(username).check();
    }
};

export default Bot;
