//controller clear database and save the scrap info from scrap_results to db

const {scrapResults} = require("../scrapper/scrap_results");
const tabla_posiciones = require('../models/Tabla_posiciones')

module.exports.Tabla_posiciones_saveToBd = async ()=>{
    try {
        const table = await scrapResults();
        if(table.length<26 ||table[0]==="Error"){
            console.warn("Error, no data in table. - posicionesController")
            return("Error, no data in table. - posicionesController")
        }
        //console.log("actualizando datos en bd")
        //clear database and upload new data
        tabla_posiciones.deleteMany({}).then(res =>{
            tabla_posiciones.insertMany(table)
        })
        
    } catch (error) {
        console.error(error)
    }
   
}
