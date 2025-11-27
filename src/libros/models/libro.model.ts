import { Schema, model } from "mongoose"

type BookType = {
  nombre: string
  genero: string
  autor: string
  editorial: string
  fechaPublicacion: Date
  disponible: boolean
  activo: boolean
}

const BookSchema = new Schema<BookType>({
  nombre: { type: String, required: true },
  genero:{ type: String, required: true, default: "Desconocido" },
  autor: { type: String, required: true, default: "Desconocido" },
  editorial: { type: String, required: true, default: "Desconocido" },
  fechaPublicacion: { type: Date, required: true },
  disponible: { type: Boolean, default: true },
  activo: { type: Boolean, default: true }
})

const BookModel = model<BookType>("Book", BookSchema)

export {BookModel, BookSchema, BookType}