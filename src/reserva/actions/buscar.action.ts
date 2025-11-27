import { ReservationModel } from "../models/reserva.model"

async function buscarHistorialByUsuario(userId: string) {
  return await ReservationModel.find({ usuario: userId }).populate("libro", "nombre")
}

async function buscarHistorialByLibro(libroId: string) {
  return await ReservationModel.find({ libro: libroId }).populate("usuario", "nombre")
}

export { buscarHistorialByUsuario, buscarHistorialByLibro }