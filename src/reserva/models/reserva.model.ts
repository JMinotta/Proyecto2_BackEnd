import { Schema, model} from "mongoose"

type ReservationType = {
  usuario: Schema.Types.ObjectId | string
  libro: Schema.Types.ObjectId | string
  fechaReserva: Date
  fechaEntrega: Date | null
}

const ReservationSchema = new Schema<ReservationType>({
  usuario: { type: Schema.Types.ObjectId, ref: "User", required: true },
  libro: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  fechaReserva: { type: Date, default: Date.now },
  fechaEntrega: {type: Date, required: true}
})

const ReservationModel = model<ReservationType>("Reservation", ReservationSchema)

export {ReservationModel, ReservationSchema, ReservationType}
