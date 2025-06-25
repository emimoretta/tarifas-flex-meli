import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const config = {
  maxDuration: 20
};

export default async function handler(req, res) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto('https://www.mercadolibre.com.ar/ayuda/25630', { waitUntil: 'networkidle0' });

  const valor = await page.evaluate(() => {
    const tbody = document.querySelector('tbody');
    const fila = tbody?.querySelectorAll('tr')[2];
    const celda = fila?.querySelectorAll('td')[1];
    return celda?.innerText?.trim() || null;
  });

  await browser.close();

  if (!valor) {
    return res.status(500).json({ error: 'Valor no encontrado' });
  }

  res.status(200).json({ valor });
}
