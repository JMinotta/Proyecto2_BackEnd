import { UserModel } from "../models/usuario.model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

async function loginUser(email: string, password: string): Promise<{ token: string }> {
  const user = await UserModel.findOne({email, activo: true })

  if (!user) throw new Error("Usuario no encontrado")

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) throw new Error("Credenciales inválidas")

  const token = jwt.sign(
    { id: user._id, permisos: user.permisos },
    process.env.JWT_SECRET!
  )

  return { token }
}

async function buscarUsuario(id: string, activo?: boolean) {
  const filtro: any = { _id: id }
  
  if (activo !== undefined) {
    filtro.activo = activo
  } else {
    filtro.activo = true
  }

  const user = await UserModel.findOne(filtro)

  if (!user) throw new Error("Usuario no encontrado")
  return user
}

export{loginUser, buscarUsuario}