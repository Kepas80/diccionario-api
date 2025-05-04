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
