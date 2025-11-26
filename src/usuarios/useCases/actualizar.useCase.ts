import { UserModel } from "../models/usuario.model";

async function actualizarUsuario(userId: string,data: any) {
  return await UserModel.findByIdAndUpdate(userId, data, {
    new: true
  });
}

export { actualizarUsuario }