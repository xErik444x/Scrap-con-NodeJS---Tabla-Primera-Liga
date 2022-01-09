//imports
const cheerio = require("cheerio")
const axios = require("axios")

//const
const url = "https://www.futbolargentino.com/primera-division/posiciones"

//main scrap
module.exports.scrapResults = async function scrapResults() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data)

        let results = []
        const table_results = $("table tbody tr");
        
        table_results.each((i, el) => {
            results.push({
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
            })
        })
        return(results)
    } catch (error) {
        return(["Error",error])
    }



}


