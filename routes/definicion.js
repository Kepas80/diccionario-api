const express = require('express');
const fetch = require('node-fetch');
const { Configuration, OpenAIApi } = require('openai');

const router = express.Router();

// ✅ Configuración de la API de OpenAI (usando clave desde variable de entorno)
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// ✅ Función para generar una frase con gpt-3.5-turbo
async function generarFrase(palabra) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Write one example sentence using the word "${palabra}" in English.`
        }
      ],
      max_tokens: 50,
    });

    return completion.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Error consultando OpenAI:');

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message || error);
    }

    return "No example available at the moment.";
  }
}

// ✅ Ruta principal POST /definicion
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

// ✅ Exporta correctamente el router
module.exports = router;
