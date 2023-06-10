import { readFileSync } from 'node:fs';
import { getConfig } from "./configManager.js";
const validTokenRegex = /[a-z0-9A-Z]{20, 30}\.[a-z0-9A-Z]{4, 10}\.[a-z0-9A-Z]{30, 50}/g

export function getTokens() {
    const tokensPath = getConfig().tokens_path

    if (!tokensPath) return

    const validTokens = readFileSync(tokensPath, 'utf8')
        .replace(/\r/gi, '')
        .trim()
        .match(validTokenRegex)
        .split(/\s+/)

    return validTokens
}

export function getToken() {
    const tokens = getTokens()

    if (!tokens?.length) throw new Error("Gateway API Key(s) Not Found")

    const randomToken = tokens[Math.floor(Math.random() * tokens.length)]

    return randomToken
}