// archivo: api/ml-zona-lejana.js

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export const config = { runtime: 'nodejs18.x', maxDuration: 20 };

export default async function handler(req, res) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto('https://www.mercadolibre.com.ar/ayuda/25630', { waitUntil: 'networkidle0' });

  const valor = await page.evaluate(() => {
    const tb = document.querySelector('tbody');
    if (!tb) return null;
    const tr = tb.querySelectorAll('tr')[2];
    if (!tr) return null;
    const td = tr.querySelectorAll('td')[1];
    return td?.innerText?.trim() || null;
  });

  await browser.close();

  if (!valor) return res.status(500).json({ error: 'Valor no encontrado' });
  res.status(200).json({ valor });
}