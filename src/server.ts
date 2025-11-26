import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import usuarioRoutes from "./usuarios/route/usuario.route";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/usuarios", usuarioRoutes);

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.error(err));

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto", process.env.PORT);
});
