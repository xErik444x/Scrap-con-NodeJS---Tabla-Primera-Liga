//Imports
const express = require("express");
const {Tabla_posiciones_saveToBd} = require("./controller/posicionesController")

//DataBase
const mongoose = require("mongoose");
const url = process.env.mongoDbUrl;
const timeUpdateScrap = process.env.MillisecondstimeUpdateScrap;

//check if url is defined
if(!url){ throw new Error("No url defined");}

if(!timeUpdateScrap || timeUpdateScrap<2000){ throw("MillisecondstimeUpdateScrap is not defined or is less than 2000 milliseconds");}

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
  console.log('connection success to db')
  
  Tabla_posiciones_saveToBd()

  setInterval(() => {
    Tabla_posiciones_saveToBd()
  }, timeUpdateScrap );
}) 
.catch(e => console.log('error connection db', e))


//App 
const app = express()
const port = process.env.PORT

if(!port){ throw new Error("No port defined");}

app.set('view engine', 'hbs');

app.set("views", __dirname + "/views");

app.use(express.static('public'))

const modelo_tabla_posiciones = require("./models/Tabla_posiciones")
app.get('/argentina', async (req, res) => {
  try {
    modelo_tabla_posiciones.find().sort({'pos': 1});
      res.render("Posiciones",{
          title: "Liga Profesional - Tabla De Posiciones",
          arrayPosiciones
      })
  } catch (error) {
      console.log("Error routes_tabla_posiciones " + error)
  }
})




app.listen(port, () => {
  console.log(`app listening!`)
})

