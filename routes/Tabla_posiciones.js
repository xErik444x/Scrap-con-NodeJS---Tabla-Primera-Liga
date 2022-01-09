//es la encargada de renderizar la tabla de posiciones usando la vista de posiciones.

const express = require('express');
const router = express.Router();

const tabla_posiciones = require('../models/Tabla_posiciones')

router.get('/posiciones', async (req, res) => {
    try {
        const arrayPosiciones = await tabla_posiciones.find().sort({'pos': 1});
        res.render("Posiciones",{
            title: "Liga Profesional - Tabla De Posiciones",
            arrayPosiciones
        })
    } catch (error) {
        console.log("Error routes_tabla_posiciones " + error)
    }
})

module.exports = router;