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
    inhabilitarUsuarios: boolean,
    verUsuarios: boolean
  }
  activo: boolean
}

const UserSchema = new Schema<UserType>({
  nombre: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  permisos: {
    crearLibros: { type: Boolean, default: false}, 
    modificarLibros: { type: Boolean, default: false},
    borrarLibros: { type: Boolean, default: false},
    modificarUsuarios: { type: Boolean, default: false },
    inhabilitarUsuarios: { type: Boolean, default: false },
    verUsuarios: { type: Boolean, default: false }
  },
  activo: { type: Boolean, default: true }
})

const UserModel = model<UserType>("User", UserSchema)

export {UserModel, UserSchema, UserType}
