const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// ✅ Habilitar CORS (para poder consumir desde tu frontend alojado externamente)
app.use(cors());

// ✅ Middleware para leer JSON en solicitudes POST
app.use(express.json());

// ✅ Servir archivos estáticos (por ejemplo, index.html en /public)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Conectar la ruta del diccionario
const definicionRouter = require('./routes/definicion');
app.use('/definicion', definicionRouter);

// ✅ Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
