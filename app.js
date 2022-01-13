//Imports
const express = require("express");
const mongoose = require("mongoose");
const handlebars = require('express-handlebars');


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
const {scrapResults} = require("./scrapper/scrap_results");
//check if url is defined
if(!url){ throw new Error("No ENV mongoDbUrl defined");}

if(!timeUpdateScrap || timeUpdateScrap<2000){ throw("MillisecondstimeUpdateScrap is not defined or is less than 2000 milliseconds");}

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
.catch(e => console.log(url+' error connection db \n', e))



//App 
const app = express()
const port = process.env.PORT

if(!port){ throw new Error("No PORT ENV VARIABLE defined");}

app.set('view engine', 'hbs');


//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', handlebars.engine({
  extname: 'hbs',
  defaultLayout: null,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    IsAscent: function (pos) {
      return pos<=4;
    },
    IsDescent: function (pos, size ) {
      console.log(size)
      console.log(pos)
      return pos>=size-4 && pos<=size;
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
        const arrayPosiciones = await modelo_tabla_posiciones.findById(id);
          if(arrayPosiciones<1){
            //if error, render default ligue ("Argentina Primera División")
            arrayPosiciones = await modelo_tabla_posiciones.find({league:"Argentina Primera División"});
            res.render("Posiciones",{
                title: arrayPosiciones[0].league,
                size: arrayPosiciones[0].size,
                data: arrayPosiciones[0].data
            })
            return;
          }else{
            res.render("Posiciones",{
              title: arrayPosiciones.league,
              size: arrayPosiciones.size,
              data: arrayPosiciones.data
          })
          }

         
        
    }else{
      //if error, render default ligue ("Argentina Primera División")
      arrayPosiciones = await modelo_tabla_posiciones.find({league:"Argentina Primera División"});
      console.log(arrayPosiciones)
      res.render("Posiciones",{
          title: arrayPosiciones[0].league,
          size: arrayPosiciones[0].size,
          data: arrayPosiciones[0].data
      })
      return;
    
    }
    
  } catch (error) {
      console.log("Error in line 25 " + error)
  }
})

app.listen(port, () => {
  console.log(`app listening!`)
})


//handlebars helpers


//el ascenso y descenso solo funciona si la liga es "Argentina Primera División"
// Handlebars.registerHelper('isPrimeraDivision', function (name ) {
//   return name == "Argentina Primera División";
// });

