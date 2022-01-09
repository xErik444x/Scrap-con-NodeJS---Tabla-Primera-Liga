const mongoose = require("mongoose");
const { Schema } = mongoose;

const tabla_posicionesSchema = new Schema({
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
  });

const Tabla_posiciones = mongoose.model("Tabla_posiciones",tabla_posicionesSchema)

module.exports = Tabla_posiciones;