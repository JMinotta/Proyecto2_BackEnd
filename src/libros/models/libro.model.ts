import { Schema, model } from "mongoose";

type BookType = {
  nombre: string;
  genero: string;
  autor: string;
  editorial: string;
  fechaPublicacion: Date;
  disponible: boolean;
  activo: boolean;
}

const BookSchema = new Schema<BookType>({
  nombre: String,
  genero: String,
  autor: String,
  editorial: String,
  fechaPublicacion: Date,
  disponible: { type: Boolean, default: true },
  activo: { type: Boolean, default: true }
});

const BookModel = model<BookType>("Book", BookSchema);

export {BookModel, BookSchema, BookType}