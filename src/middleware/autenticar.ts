import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UserModel, UserType } from "../usuarios/models/usuario.model"


type AuthRequest = Request & {
  user?: UserType & { _id: string }
  userId?: string
}

const authenticate = async (req: AuthRequest,res: Response,next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "No se proporcionó token de autenticación" })
      return
    }
    const token = authHeader.replace("Bearer ", "")

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string
    }

    const user = await UserModel.findOne({ _id: decoded.id, activo: true })

    if (!user) {
      res.status(401).json({ error: "Token inválido o usuario inactivo" })
      return
    }

    req.user = user as any
    req.userId = user._id.toString()

    next()
  } catch (error) {
    res.status(401).json({ error: "Autenticación fallida" })
  }
}


type PermissionKey = keyof UserType["permisos"]

const verPermisos = (permission: PermissionKey) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const { id } = req.params
    if (req.userId === id) {
      return next()
    }
    if (!req.user || !req.user.permisos[permission]) {
      res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" })
      return
    }

    next()
  }
}



export { authenticate, verPermisos, AuthRequest, PermissionKey }