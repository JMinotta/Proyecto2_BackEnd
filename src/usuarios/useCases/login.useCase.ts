import { UserModel } from "../models/usuario.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(correo: string, password: string) {
  const user = await UserModel.findOne({ correo, activo: true });

  if (!user) throw new Error("Usuario no encontrado");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Credenciales inválidas");

  const token = jwt.sign(
    { id: user._id, permisos: user.permisos },
    process.env.JWT_SECRET!
  );

  return { token };
}
