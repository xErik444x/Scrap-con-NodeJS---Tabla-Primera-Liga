//Imports
const express = require("express");
const mongoose = require("mongoose");
const handlebars = require('express-handlebars');
const {scrapResults} = require("./scrapper/scrap_results");

//DataBase MODEL
const { Schema } = mongoose
const Tabla_posicionesSchema = new Schema({
  league: String,
  size:Number,
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

//check if url is defined
if(!url){ throw new Error("No ENV mongoDbUrl defined");}
//check if MillisecondstimeUpdateScrap is defined
if(!timeUpdateScrap || timeUpdateScrap<2000){ throw("MillisecondstimeUpdateScrap is not defined or is less than 2000 milliseconds");}

//leagues to scrap
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
      if(results === 404){
        console.warn("no results for league: "+league.name+" url: "+league.url)
        return;
      }
      modelo_tabla_posiciones.findOneAndUpdate({league:league.name}, results, {upsert: true}, function(err, doc) {
        if (err) console.log(500, {error: err});
        console.log('Succesfully saved.');
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
.catch(e => console.log(url+' error connection db \n', e))



//App 
const app = express()
const port = process.env.PORT

if(!port){ throw new Error("No PORT ENV VARIABLE defined");}

app.set('view engine', 'hbs');


//Sets handlebars configurations
app.engine('hbs', handlebars.engine({
  extname: 'hbs',
  defaultLayout: null,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    eq: (v1, v2) => v1 === v2,
    IsAscent: function (pos,title) {
      return pos<=4 && title === "Argentina Primera División";
    },
    IsDescent: function (pos, size,title ) {
      return pos>size-4 && pos<=size && title === "Argentina Primera División";
    },
    equalGroup: function (group,data,index ) {
      //regular is default
      if(group==="Regular"){
        return false;
      }
      if(index<=1){
        return false
      }
      return (group!==data[index-1].group);
    }
  },
  }));

app.set("views", __dirname + "/views");

app.use(express.static('public'))

app.get('/posiciones', async (req, res) => {
  try {
    //?id
    const id = req.query.id;
    if(id != null){
        console.log("hay id:" + id)
        modelo_tabla_posiciones.findById(id, async (err, arrayPosiciones )=>{
          if (err || !arrayPosiciones){
            res.send("Error id not found");
            return;
          } 
          const leagues = await modelo_tabla_posiciones.find({}).select('league');
          console.log("enviando respuesta!")
          res.render("Posiciones",{
            title: arrayPosiciones.league,
            size: arrayPosiciones.size,
            id: arrayPosiciones.id,
            data: arrayPosiciones.data,
            leagues: leagues,
        })
        
        }) 
          
    }else{
      //get default data
      modelo_tabla_posiciones.find({league:"Argentina Primera División"}).then(async (arrayPosiciones,err )=>{
        if (err || !arrayPosiciones){
          console.log(500, {error: err});
          return;
        } 
        const leagues = await modelo_tabla_posiciones.find({}).select('league');
          res.render("Posiciones",{
            title: arrayPosiciones[0].league,
            size: arrayPosiciones[0].size,
            id: arrayPosiciones[0].id,
            data: arrayPosiciones[0].data,
            leagues: leagues,
        })
      
      }); 
    
    }
    
  } catch (error) {
      console.warn(error)
  }
})

app.listen(port, () => {
  console.log(`app listening!`)
})


