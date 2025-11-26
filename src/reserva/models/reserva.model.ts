import { Schema, model} from "mongoose";

type ReservationType = {
  usuario: Schema.Types.ObjectId;
  libro: Schema.Types.ObjectId;
  fechaReserva: Date;
  fechaEntrega: Date | null;
}

const ReservationSchema = new Schema<ReservationType>({
  usuario: { type: Schema.Types.ObjectId, ref: "User" },
  libro: { type: Schema.Types.ObjectId, ref: "Book" },
  fechaReserva: { type: Date, default: Date.now },
  fechaEntrega: Date
});

const ReservationModel = model<ReservationType>("Reservation", ReservationSchema);

export {ReservationModel, ReservationSchema, ReservationType}
