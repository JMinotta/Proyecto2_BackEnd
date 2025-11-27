import { BookModel } from "../models/libro.model"

export async function crearLibro(data: any) {
  return await BookModel.create(data)
}
