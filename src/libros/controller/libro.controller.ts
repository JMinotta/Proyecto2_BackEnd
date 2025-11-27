import { Request, Response } from "express"
import { crearLibro} from "../actions/crear.action"
import { buscarLibros, buscarLibro } from "../actions/buscar.action"
import { eliminarLibro} from "../actions/eliminar.action"
import { actualizarLibro } from "../actions/actualizar.action"

class LibroController {
  static async crear(req: Request, res: Response) {
    try {
        const libro = await crearLibro(req.body)
        res.json(libro)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
  }

  static async buscarVarios(req: Request, res: Response) {
    try {
        const result = await buscarLibros(req.query)
        res.json(result)
    } catch (error) {
    res.status(400).json({ error: (error as Error).message })
    }
 }

  static async buscarUno(req: Request, res: Response) {
    try{
        const activo = req.query.activo ? req.query.activo === "true" : undefined
    const book = await buscarLibro(req.params.id, activo)
    res.json(book)
    }  catch (error) {
    res.status(404).json({ error: (error as Error).message })
    }
 }

  static async eliminar(req: Request, res: Response) {
    try {
      await eliminarLibro(req.params.id)
      res.json({ mensaje: "Libro inhabilitado" })
    } catch (e: any) {
      res.status(403).json({ error: e.message })
    }
  }
 
  static async actualizar(req: Request, res: Response) {
    try {
      const result = await actualizarLibro(req.params.id,req.body)
      res.json(result)
    } catch (e: any) {
      res.status(403).json({ error: e.message })
    }
  }

}

export { LibroController }