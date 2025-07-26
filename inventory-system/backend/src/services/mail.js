import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER || 'your.email@gmail.com';
const GMAIL_PASS = process.env.GMAIL_PASS || 'your_app_password'; // 🔁 Use Gmail App Password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

export async function sendEmailAlert(products) {
  if (!GMAIL_USER || !GMAIL_PASS) {
    console.warn('⚠️ Missing Gmail credentials. Skipping email alert.');
    return;
  }

  const productList = products.map(p => `${p.name} (Stock: ${p.stock})`).join('\n');

  const mailOptions = {
    from: `"Inventory Alert Bot" <${GMAIL_USER}>`,
    to: GMAIL_USER, // you can add a comma-separated list of recipients here
    subject: '🚨 Low Stock Alert - Inventory System',
    text: `⚠️ The following products are low on stock:\n\n${productList}\n\nPlease restock soon.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Gmail alert sent!');
  } catch (err) {
    console.error('❌ Email alert failed:', err.message);
  }
}

