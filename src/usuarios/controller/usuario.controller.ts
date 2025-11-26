import { Request, Response } from "express"
import { crearUsuario } from "../useCases/crear.useCase"
import { loginUser } from "../useCases/login.useCase"
import { actualizarUsuario } from "../useCases/actualizar.useCase"
import { eliminarUsuario} from "../useCases/Eliminar.useCase"
import { UserModel } from "../models/usuario.model"

 class UserController {
  static async registrar(req: Request, res: Response) {
    try {
      const user = await crearUsuario(req.body);
      res.json(user);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { correo, password } = req.body;
      const result = await loginUser(correo, password);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  static async getUsuario(req: Request, res: Response) {
    const user = await UserModel.findById(req.user!.id);
    res.json(user);
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const result = await actualizarUsuario(
        req.params.id,
        req.body,
      );
      res.json(result);
    } catch (e: any) {
      res.status(403).json({ error: e.message });
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      await eliminarUsuario(req.params.id);
      res.json({ mensaje: "Usuario inhabilitado" });
    } catch (e: any) {
      res.status(403).json({ error: e.message });
    }
  }
}

export { UserController }