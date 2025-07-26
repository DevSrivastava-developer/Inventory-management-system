// Top of file:
import db from '../utils/db.js';
//import { sendEmailAlert } from './mail.js';
//import { sendSlackAlert } from './slack.js';
import { logToMongo } from './logger.js';

let lastAlertedProductIds = new Set();

export async function lowStockScanner() {
  try {
    const lowStock = await db('products').where('stock', '<=', db.ref('threshold'));

    // Only alert for new products (not alerted before)
    const newAlerts = lowStock.filter(p => !lastAlertedProductIds.has(p.id));

    if (newAlerts.length > 0) {
      console.log('⚠️ LOW_STOCK trigger:', newAlerts.map(p => p.name));

      webSocketServer.emit('LOW_STOCK', newAlerts);
      //await sendEmailAlert(newAlerts);
      await logToMongo(newAlerts);
      //await sendSlackAlert(newAlerts);

      // Mark these products as alerted
      newAlerts.forEach(p => lastAlertedProductIds.add(p.id));
    }

    // Optional: remove from set if stock has been replenished
    const allStock = await db('products');
    allStock.forEach(p => {
      if (p.stock > p.threshold) {
        lastAlertedProductIds.delete(p.id);
      }
    });

  } catch (err) {
    console.error('❌ Error in lowStockScanner:', err.message);
  }
}

