import { readFile } from 'fs/promises';

export interface Config {
    port: number;
    defaultSensitivity: number;
}

export async function loadConfig(): Promise<Config> {
    try {
        const configFile = await readFile('config.json', {encoding: 'utf-8'});
        return JSON.parse(configFile);
    } catch (error) {
        console.warn('Failed to load config file, using defaults:', error);
        return {
            port: 8080,
            defaultSensitivity: 10,
        };
    }
}