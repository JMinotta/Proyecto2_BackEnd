import { ReservationModel } from "../models/reserva.model"
import { BookModel } from "../../libros/models/libro.model"

async function crearReserva(usuarioId: string, libroId: string, fechaEntrega: Date) {
  
    const libro = await BookModel.findById(libroId)
    if (!libro) {
        throw new Error("Libro no encontrado")
    }

    if (!libro.activo) {
        throw new Error("El libro no está activo")
    }  

    if (!libro.disponible) {
        throw new Error("El libro no está disponible")
    }

    libro.disponible = false
    await libro.save()

    return await ReservationModel.create({
    usuario: usuarioId,
    libro: libroId,
    fechaEntrega: fechaEntrega
  })
}

async function devolverLibro(bookId: string) {
  try {
    const libro  = await BookModel.findById(bookId)
    if (!libro ) {
      throw new Error('No se encontró el libro con el id proporcionado')
    }
    if (libro .disponible) {
      throw new Error('El libro ya está disponible')
    }

    libro .disponible = true
    await libro .save()

    return libro 
  } catch (error: any) {
    throw new Error(`Error devolviendo libro: ${error.message}`)
  }
}

export { crearReserva, devolverLibro }