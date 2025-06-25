import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const { data: html } = await axios.get('https://www.mercadolibre.com.ar/ayuda/25630');
    const $ = cheerio.load(html);

    const row = $('tbody tr').eq(2);
    const valueText = row.find('td').eq(1).text().trim();

    if (!valueText) {
      return res.status(500).json({ error: 'No se pudo obtener el valor de la tabla.' });
    }

    const tarifa = parseFloat(valueText.replace(/[^\d,]/g, '').replace(',', '.'));

    return res.status(200).json({ tarifa });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
