import { UserModel } from "../models/usuario.model"

async function eliminarUsuario(userId: string) {
  return await UserModel.findByIdAndUpdate(userId, { activo: false })
}

export{ eliminarUsuario }