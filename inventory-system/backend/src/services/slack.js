import { IncomingWebhook } from '@slack/webhook';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK || 'https://hooks.slack.com/services/test/test/test';
const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

export async function sendSlackAlert(products) {
  if (!SLACK_WEBHOOK_URL.startsWith('https://hooks.slack.com')) {
    console.warn('⚠️ Invalid Slack webhook URL. Skipping Slack alert.');
    return;
  }

  try {
    const message = products.map(p => `*${p.name}* is low on stock! Only ${p.stock} left.`).join('\n');

    await webhook.send({
      text: `🚨 *Low Stock Alert:*\n${message}`
    });

    console.log('✅ Slack alert sent!');
  } catch (err) {
    console.error('❌ Slack alert failed:', err.message);
  }
}
