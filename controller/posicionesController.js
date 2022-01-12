const {scrapResults} = require("../scrapper/scrap_results");

const tabla_posiciones = require('../models/Tabla_posiciones');


module.exports.Tabla_posiciones_saveToBd = async ()=>{
    try {
        const table = await scrapResults();
        const data = await tabla_posiciones.find({});
        if(data.length<1){
            //if no data, upload all scrap data
            tabla_posiciones.insertMany(table)

        }else{
            //compare scrap data and database data
            //if scraping is different from database, update them
            console.warn("17 posiciones controller")
        }

    } catch (error) {
        console.error(error)
    }
   
}
