import axios from 'axios'

export function sendWebhook(username,) {
    if (!process.env.WEBHOOK_URL) return

    const data = {
        embeds: [{
            title: "Valid Username Found",
            description: username,
            color: '3735379'
        }]
    }

    axios.post(process.env.WEBHOOK_URL, data,)
}