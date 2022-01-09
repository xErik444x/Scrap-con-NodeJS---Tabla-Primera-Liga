//controller clear database and save the scrap info from scrap_results to db

const {scrapResults} = require("../scrapper/scrap_results");
const tabla_posiciones = require('../models/Tabla_posiciones');
const { off } = require("../models/Tabla_posiciones");

module.exports.Tabla_posiciones_saveToBd = async ()=>{
    try {
        const table = await scrapResults();
        if(table.length<26 ||table[0]==="Error"){
            console.warn("Error, no data in table. - posicionesController");
            return("Error, no data in table. - posicionesController");
        }
        const data = await tabla_posiciones.find({});

        if(data.length<1){
            //if no data, upload all scrap data
            tabla_posiciones.insertMany(table)

        }else{
            //compare scrap data and database data
            //if scraping is different from database, update them
            table.forEach((e,i) => {
                if(e.team_name_large != data[i].team_name_large || e.pts != data[i].pts){
                    tabla_posiciones.findByIdAndUpdate(data[i].id,e, function(err){
                        if(err){
                            console.warn(err)
                        }
                        //updated successfully
                    })
                }
            });
        }

    } catch (error) {
        console.error(error)
    }
   
}
