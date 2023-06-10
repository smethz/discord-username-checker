import inquirer from "inquirer";
import { updateEnv } from '../configManager.js';

export async function askWebHook() {

    // New Webhook
    const promptAnswer = await inquirer.prompt({
        name: 'webhook',
        type: "list",
        message: 'Do you want to send valid usernames to a Discord Webhook:',
        default: () => {
            if (process.env.WEBHOOK_URL) return 0
            return 1
        }
        , choices: ['Yes', 'No']
    })

    if (promptAnswer.webhook == 'Yes') {
        await askWebHookURL()
        console.log('Valid Usernames will be sent to the webhook url you provided')
    }
}

export async function askWebHookURL() {
    const prompt = {
        name: 'webhook_url',
        type: "password",
        mask: '*',
        message: 'Input your Webhook URL:',
        validate: (url) => {
            if (!url.startsWith('https://discord.com/api/webhooks')) {
                return 'The url you provided is not a valid discord webhook url'
            }

            return true
        }
    }

    if (process.env.WEBHOOK_URL) {
        prompt['default'] = process.env.WEBHOOK_URL
    }

    const promptAnswer = await inquirer.prompt(prompt)

    const webhookURL = Object.values(promptAnswer)[0]

    await updateEnv('WEBHOOK_URL', webhookURL)
}