import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const { data: html } = await axios.get('https://www.mercadolibre.com.ar/ayuda/25630');
    const $ = cheerio.load(html);

    // Obtenemos la segunda fila de la tabla (índice 2)
    const row = $('tbody tr').eq(2);
    const valueText = row.find('td').eq(1).text().trim();

    if (!valueText) {
      return res.status(500).json({ error: 'No se pudo obtener el valor de la tabla.' });
    }

    // Extraemos el número como string tipo "9442,99", y lo pasamos a float (9442.99)
    const number = parseFloat(valueText.replace(/[^\d,]/g, '').replace(',', '.'));

    return res.status(200).send(number.toString());
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
