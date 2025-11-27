import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from "mongoose"
import cors from 'cors'
import usuarioRoute from "./usuarios/route/usuario.route"
import libroRoute from "./libros/route/libro.route"
import reservaRoute from "./reserva/route/reserva.route"

const app = express()
app.use(express.json())
app.use(cors())
app.use("/api/usuarios", usuarioRoute)
app.use("/api/libros", libroRoute)
app.use("/api/reservas", reservaRoute)


if (process.env.NODE_ENV !== "test"){
  mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("Mongo conectado"))
    .catch(err => console.error(err))

  app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en puerto", process.env.PORT)
  })
}


export default app
