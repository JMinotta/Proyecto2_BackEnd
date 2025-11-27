import { Request, Response } from "express"
import {crearReserva, devolverLibro} from "../actions/crear.action"
import {buscarHistorialByLibro, buscarHistorialByUsuario} from "../actions/buscar.action"

class ReservaController {
  static async reserva(req: Request, res: Response) {
    try{
        const reserva = await crearReserva(req.userId, req.body.libroId,req.body.fechaEntrega)
        res.json(reserva)
    } catch (error:any){
      res.status(400).json({error: error.message})
    }
  }

  static async historiaByLibro(req: Request, res: Response) {
    try {
        const hist = await buscarHistorialByLibro(req.params.id)
        res.json(hist)
    } catch (error:any){
      res.status(400).json({error: error.message})
    }
  }

  static async historiaByUsuario(req: Request, res: Response) {
    try {
    const hist = await buscarHistorialByUsuario(req.params.id)
    res.json(hist)
    } catch (error:any){
      res.status(400).json({error: error.message})
    }
  }
  static async devolver(req: Request, res: Response) {
    try {
      const libroDevuelto = await devolverLibro(req.body.libroId)
      res.json(libroDevuelto)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

}

export { ReservaController }