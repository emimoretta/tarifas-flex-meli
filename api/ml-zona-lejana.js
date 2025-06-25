import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const config = { maxDuration: 20 };

export default async function handler(req, res) {
  let browser;

  try {
    const executablePath = await chromium.executablePath();

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
      if (!tbody) return null;
      const filas = tbody.querySelectorAll('tr');
      if (filas.length < 3) return null;
      const celdas = filas[2].querySelectorAll('td');
      if (celdas.length < 2) return null;
      const texto = celdas[1].innerText.trim();
      return parseFloat(texto.replace(/\./g, '').replace(',', '.').replace('$', '').trim());
    });

    await browser.close();

    if (!valor) return res.status(500).json({ error: 'No se pudo extraer el valor.' });

    return res.status(200).json({ valor });
  } catch (e) {
    if (browser) await browser.close();
    return res.status(500).json({ error: e.message });
  }
}