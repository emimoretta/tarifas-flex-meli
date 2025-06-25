// api/ml-zona-lejana.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const { data: html } = await axios.get("https://www.mercadolibre.com.ar/ayuda/25630");
    const $ = cheerio.load(html);

    // Selecciona la primera tabla y luego el tercer <tr> y segundo <td>
    const tdValue = $("table tbody tr").eq(2).find("td").eq(1).text().trim();

    res.status(200).json({ tarifa: tdValue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
