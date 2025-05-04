const express = require('express');
const fetch = require('node-fetch');
const { Configuration, OpenAIApi } = require("openai");

const router = express.Router();

// Configuración de la API de OpenAI
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Asegúrate de configurarlo en Render
  })
);

// Función que genera una frase de ejemplo usando la palabra
async function generarFrase(palabra) {
  const prompt = `Write an example sentence using the word "${palabra}" in English.`;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 50,
  });

  return completion.data.choices[0].text.trim();
}

// Ruta principal POST /definicion
router.post('/', async (req, res) => {
  const palabra = req.body.palabra;
  const idioma = 'en';

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

    const frase = await generarFrase(palabra);

    return res.json({
      palabra: data[0].word,
      idioma,
      definiciones,
      frase
    });
  } catch (err) {
    console.error('Error en el servidor:', err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
