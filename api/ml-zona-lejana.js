import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const config = { maxDuration: 20 };

export default async function handler(req, res) {
  let browser;

  try {
    const executablePath = await chromium.executablePath();

    if (!executablePath) {
      return res.status(500).json({ error: 'Chromium path is null. Check installation.' });
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://www.mercadolibre.com.ar/ayuda/25630', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    const valor = await page.evaluate(() => {
      const tbody = document.querySelector('tbody');
      const fila = tbody?.querySelectorAll('tr')[2];
      const celda = fila?.querySelectorAll('td')[1];
      const texto = celda?.innerText?.trim();
      if (!texto) return null;
      return parseFloat(texto.replace(/\./g, '').replace(',', '.').replace('$', ''));
    });

    await browser.close();

    if (!valor) return res.status(500).json({ error: 'No se encontró el valor esperado' });

    return res.status(200).json({ valor });
  } catch (e) {
    if (browser) await browser.close();
    return res.status(500).json({ error: e.message });
  }
}