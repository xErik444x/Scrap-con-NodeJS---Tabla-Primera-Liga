//Imports
const express = require("express");
const mongoose = require("mongoose");

//DataBase MODEL

const { Schema } = mongoose
const Tabla_posicionesSchema = new Schema({
  league: String,
  data: [{
    pos:  Number,
    team_img: String,
    team_name_large: String,
    team_name_short: String,
    pj: Number,
    g: Number,
    e: Number, 
    p: Number,
    gf: Number,
    gc: Number,
    dg: Number,
    pts: Number,
    group: String,
  }],

});
  
const modelo_tabla_posiciones = mongoose.model("Tabla_posicionesV2",Tabla_posicionesSchema)


const url = process.env.mongoDbUrl;
const timeUpdateScrap = process.env.MillisecondstimeUpdateScrap;
const {scrapResults} = require("./scrapper/scrap_results");
//check if url is defined
if(typeof(url) === undefined){ throw new Error("No ENV mongoDbUrl defined");}

if((typeof(timeUpdateScrap) === undefined) || timeUpdateScrap<2000){ throw("MillisecondstimeUpdateScrap is not defined or is less than 2000 milliseconds");}

//leagues in pages to scrap
const leagues = [
  {
    name:"Copa Libertadores",
    url: "https://www.futbolargentino.com/copa-libertadores/tabla-de-posiciones"
  },
  {
    name:"Argentina Primera División",
    url: "https://www.futbolargentino.com/primera-division/tabla-de-posiciones",
  },
  {
    name:"QATAR 2022",
    url:"https://www.futbolargentino.com/eliminatorias/tabla-de-posiciones"
  }
 
]

//function to scrap and save data to database
function saveScrapToBD(){
  leagues.map((league,i)=>{
    scrapResults(league.url,league.name).then((results)=>{
      modelo_tabla_posiciones.findOneAndUpdate({league:league.name}, results, {upsert: true}, function(err, doc) {
        if (err) console.log(500, {error: err});
        //console.log('Succesfully saved.');
        });
    })
  });
}

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async ()=> {
  console.log('connection success to db')
  saveScrapToBD() //scrap and save data to database
  setInterval(() => {
    saveScrapToBD() 
  }, timeUpdateScrap >20000 || 20000);

}) 
.catch(e => console.log('error connection db', e))



//App 
const app = express()
const port = process.env.PORT

if(!port){ throw new Error("No PORT ENV VARIABLE defined");}

app.set('view engine', 'hbs');

app.set("views", __dirname + "/views");

app.use(express.static('public'))

app.get('/argentina', async (req, res) => {
  try {
    arrayPosiciones = await modelo_tabla_posiciones.find({league:"Copa Libertadores"}).sort({'pos': 1});
    console.log(arrayPosiciones[0].data)  
    res.render("Posiciones",{
          title: arrayPosiciones[0].league,
          data: arrayPosiciones[0].data
      })
  } catch (error) {
      console.log("Error in line 25 " + error)
  }
})

app.listen(port, () => {
  console.log(`app listening!`)
})

