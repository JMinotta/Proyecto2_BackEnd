import { BookModel } from "../models/libro.model"

async function eliminarLibro(bookId: string) {
    return await BookModel.findByIdAndUpdate(bookId, { activo: false })
}

export { eliminarLibro }