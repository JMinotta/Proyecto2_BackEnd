import { UserModel } from "../models/usuario.model";

export async function eliminarUsuario(userId: string) {
  return await UserModel.findByIdAndUpdate(userId, { activo: false });
}