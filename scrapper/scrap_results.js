//imports
const cheerio = require("cheerio")
const axios = require("axios")

//const
const url = "https://www.futbolargentino.com/copa-libertadores/tabla-de-posiciones"

//main scrap
//export as default this function
module.exports.scrapResults = async (url,leagueName) =>{
    if(!url){ throw new Error("No url defined")}
    if(!leagueName){ throw new Error("No leagueName defined")}

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data)

        
        const table_results = $(".fase.card table tbody tr");
        let results = {
                league:leagueName,
                data:[]
            }
        //print parent of table_results
        
        table_results.each((i, el) => {
            results.data.push({
                pos: $(el).find("td").eq(0).text().trim(),
                team_img: $(el).find("img").attr("data-src"),
                team_name_large: $(el).find("td").eq(1).find("span").eq(0).text().trim(),
                team_name_short: $(el).find("td").eq(1).find("span").eq(1).text().trim(),
                pj: $(el).find("td").eq(2).text().trim(),
                g: $(el).find("td").eq(3).text().trim(),
                e: $(el).find("td").eq(4).text().trim(),
                p: $(el).find("td").eq(5).text().trim(),
                gf:$(el).find("td").eq(6).text().trim(),
                gc:$(el).find("td").eq(7).text().trim(),
                dg: $(el).find("td").eq(8).text().trim(),
                pts: $(el).find("td").eq(9).text().trim(),
                group: $(el).parent().parent().parent().parent().parent().find("span").eq(0).text().trim()
            })
        })
        //console.log(results)
        return(results)
    } catch (error) {
        console.log(error)
        return(["Error",error])
    }



}


