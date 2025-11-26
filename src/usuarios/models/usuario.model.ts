import { Schema, model} from "mongoose"

type UserType = {
  nombre: string
  email: string
  password: string
  permisos: {
    crearLibros: boolean
    modificarLibros: boolean
    borrarLibros: boolean
    modificarUsuarios: boolean
    inhabilitarUsuarios: boolean
  }
  activo: boolean
}

const UserSchema = new Schema<UserType>({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  permisos: {
    crearLibros: Boolean,
    modificarLibros: Boolean,
    borrarLibros: Boolean,
    modificarUsuarios: Boolean,
    inhabilitarUsuarios: Boolean
  },
  activo: { type: Boolean, default: true }
})

const UserModel = model<UserType>("User", UserSchema)

export {UserModel, UserSchema, UserType}
