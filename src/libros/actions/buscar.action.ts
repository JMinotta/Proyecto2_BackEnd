import { BookModel } from "../models/libro.model"

async function buscarLibros(query: any) {
  const filters: any = { }

  const filtros = ["genero",  "fechaPublicacion", "editorial", "autor", "nombre"]
  filtros.forEach((f) => {
    if (query[f]) filters[f] = query[f]
  })

    if (query.activo !== undefined) {
     filters.activo = query.activo === "true"
    } else {
     filters.activo = true 
    }
    
    if (query.disponible !== undefined) {
      filters.disponible = query.disponible === "true"
    }
  const pagina = parseInt(query.pagina || "1")
  const limit = 3
  const skip = (pagina - 1) * limit

  const total = await BookModel.countDocuments(filters)
  const books = await BookModel.find(filters, { nombre: 1 }).skip(skip).limit(limit)

  return {
    paginaActual: pagina,
    paginaMaxima: Math.ceil(total / limit),
    librosPorPagina: limit,
    resultados: books
  }
}

async function buscarLibro(id: string, activo?: boolean) {
   const filtro: any = { _id: id }
   if (activo !== undefined) {
    filtro.activo = activo
   } else {
    filtro.activo = true
   }

  const libro = await BookModel.findOne(filtro)

  if (!libro) throw new Error("Libro no encontrado")
  return libro
}   
export {buscarLibros, buscarLibro}
