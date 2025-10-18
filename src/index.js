require('dotenv').config(); // Carga las variables de entorno
const express = require('express');
const cors = require('cors');
const { sequelize, connectDB } = require('./config/database');

// Importar todos los modelos para que Sequelize los conozca
require('./models/ProfileModel');
require('./models/CategoryModel');
require('./models/StateModel');
require('./models/UserModel');
require('./models/NewsModel');

// Conectar a la base de datos
connectDB();

// Sincronizar modelos con la base de datos
sequelize.sync({ force: false }).then(() => console.log('Tablas sincronizadas'));

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite al servidor entender JSON en las peticiones

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Noticias de México funcionando con MySQL!');
});

// Aquí irán las rutas de la API
app.use('/api/auth', require('./routes/AuthRoute.js'));
app.use('/api', require('./routes/ProfileRoute.js'));
app.use('/api', require('./routes/UserRoute.js')); 
app.use('/api', require('./routes/StateRoute.js'));
app.use('/api', require('./routes/CategoryRoute.js'));
app.use('/api', require('./routes/NewsRoute.js')); 

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
