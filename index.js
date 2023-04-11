
const express = require ('express');
const cors = require ('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

//crear el servidor de express

const app = express();

//base de datos

dbConnection();
//directorio publico
//CORS

app.use(cors());


app.use( express.static('public') );

//lectura y parseo del body

app.use( express.json());

//rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


// hacer auth // crear , login , renew
//CRUD: Eventos
//escuchar peticiones


app.listen( process.env.PORT, ()=>{

    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
} )