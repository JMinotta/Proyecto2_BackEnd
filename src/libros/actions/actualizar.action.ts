import { BookModel } from "../models/libro.model"

async function actualizarLibro(bookId: string, data: any) {
    return await BookModel.findByIdAndUpdate(bookId, data, { new: true })
}   

export { actualizarLibro }