const express = require('express');
const path = require('path');
const app = express();

// Middleware para leer JSON en POST
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// 👉 Aquí conectamos la ruta definicion.js
const definicionRouter = require('./routes/definicion');
app.use('/definicion', definicionRouter);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
