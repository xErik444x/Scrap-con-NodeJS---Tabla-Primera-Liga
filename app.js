//Imports
const express = require("express");
const Tabla_posiciones = require("./routes/Tabla_posiciones")
const {Tabla_posiciones_saveToBd} = require("./controller/posicionesController")

//DataBase
const mongoose = require("mongoose");
const url = process.env.mongoDbUrl;
const timeUpdateScrap = process.env.timeUpdateScrap;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
  console.log('connection success to db')
  Tabla_posiciones_saveToBd()
  setTimeout(() => {
    Tabla_posiciones_saveToBd()
  }, timeUpdateScrap>60000 || 60000);
  
}) 
.catch(e => console.log('error connection db', e))


//App 
const app = express()
const port = process.env.PORT || 80

app.set('view engine', 'hbs');
app.set("views", __dirname + "/views");
app.use(express.static('public'))

app.get('/posiciones',Tabla_posiciones)

app.listen(port, () => {
  console.log(`app listening!`)
})

