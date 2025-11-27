import { UserModel } from "../models/usuario.model"

async function actualizarUsuario(userId: string, data: any) {
  if (data.password) {
    const bcrypt = await import("bcrypt")
    data.password = await bcrypt.hash(data.password, 10)
  }

  const actualizaciones: any = {}

  for (const key in data) {
    if (typeof data[key] === "object" && data[key] !== null && !Array.isArray(data[key])) {
      for (const subKey in data[key]) {
        actualizaciones[`${key}.${subKey}`] = data[key][subKey]
      }
    } else {
      actualizaciones[key] = data[key]
    }
  }

  return await UserModel.findByIdAndUpdate(
    userId,
    { $set: actualizaciones },
    { new: true, runValidators: true }
  )
}


export { actualizarUsuario }
