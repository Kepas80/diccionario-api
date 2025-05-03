const express = require('express');
const fetch = require('node-fetch'); // Asegúrate de tener node-fetch v2 instalado
const router = express.Router();

router.post('/', async (req, res) => {
  const palabra = req.body.palabra;
  const idioma = 'en'; // 🔒 Forzamos el idioma a inglés

  if (!palabra) {
    return res.status(400).json({ error: 'Falta la palabra en la solicitud.' });
  }

  const url = `https://api.dictionaryapi.dev/api/v2/entries/${idioma}/${encodeURIComponent(palabra)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!Array.isArray(data) || !data[0]?.meanings) {
      return res.status(404).json({ error: 'No se encontró definición.' });
    }

    const definiciones = data[0].meanings.flatMap(m =>
      m.definitions.map(d => d.definition)
    );

    return res.json({
      palabra: data[0].word,
      idioma,
      fuente: 'dictionaryapi.dev',
      definiciones
    });
  } catch (err) {
    console.error('Error al consultar dictionaryapi.dev:', err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
