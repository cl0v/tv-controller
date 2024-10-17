import { connectServer } from './src/websocket';
import { loadConfig } from './src/config';

async function main() {
    const config = await loadConfig();
    connectServer(config);
}

main().catch(console.error);