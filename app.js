// app.js ou server.js
const express = require('express');
const app = express();
const sequelize = require('./config/db');
require('dotenv').config();

app.use(express.json());

const requestTime = require('./common/middleware/requestTime');

app.use(requestTime);

// Testar a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });

// Sincronizar os modelos com o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
  })
  .catch(err => {
    console.error('Erro ao sincronizar os modelos:', err);
  });

// Importar e usar os módulos
const userModule = require('./modules/user/user.module');
const authModule = require('./modules/auth/auth.module');
const conversionModule = require('./modules/conversion/conversion.module');
const historyModule = require('./modules/history/history.module');


app.use('/users', userModule);
app.use('/auth', authModule);
app.use('/conversion', conversionModule);
app.use('/api', historyModule);

// Iniciar o servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;