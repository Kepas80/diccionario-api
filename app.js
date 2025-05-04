const express = require('express');
const path = require('path');
const cors = require('cors'); // ✅ Importa cors

const app = express();

// ✅ Habilita CORS para cualquier origen
app.use(cors());

// Middleware para leer JSON en solicitudes POST
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para las definiciones
const definicionRouter = require('./routes/definicion');
app.use('/definicion', definicionRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
