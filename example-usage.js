import BoursoramaApi from './BoursoramaApi.js';
import Utils from './Utils.js';
import path from 'path';

// Get temp download path
const downloadPath = path.join(Utils.dirname(), '/downloads');

const api = new BoursoramaApi(downloadPath);
await api.init();
await api.connect('accountCode', 'accountPassword');

const movements = await api.getMovements('accountNumber', '02/07/2021', '24/07/2021');
console.info(movements);

await api.disconnect();
await api.getBrowser().close();
