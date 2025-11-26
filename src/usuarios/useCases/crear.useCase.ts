import { UserModel } from "../models/usuario.model"
import bcrypt from "bcrypt"

async function crearUsuario(data: any) {
  data.password = await bcrypt.hash(data.password, 10)
  return await UserModel.create(data)
}

export { crearUsuario }