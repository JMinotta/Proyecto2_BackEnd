import { Request, Response } from "express"
import { crearUsuario } from "../actions/crear.action"
import { loginUser, buscarUsuario } from "../actions/buscar.action"
import { actualizarUsuario } from "../actions/actualizar.action"
import { eliminarUsuario} from "../actions/eliminar.action"
import { UserModel } from "../models/usuario.model"

 class UsuarioController {
  static async registrar(req: Request, res: Response) {
    try {
      const user = await crearUsuario(req.body)
      res.json(user)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await loginUser(email, password)
      res.json(result)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  static async getUsuario(req: Request, res: Response) {
    try {
      const activo = req.query.activo ? req.query.activo === "true" : undefined
      const user = await buscarUsuario(req.params.id, activo)
      res.json(user)
    } catch (e: any) {
      res.status(404).json({ error: e.message })
    }
  }

  
  static async actualizar(req: Request, res: Response) {
    try {
      const result = await actualizarUsuario(
        req.params.id,
        req.body
      )
      res.json(result)
    } catch (e: any) {
      res.status(403).json({ error: e.message })
    }
  }


  static async eliminar(req: Request, res: Response) {
    try {
      await eliminarUsuario(req.params.id)
      res.json({ mensaje: "Usuario inhabilitado" })
    } catch (e: any) {
      res.status(403).json({ error: e.message })
    }
  }
}

export { UsuarioController }