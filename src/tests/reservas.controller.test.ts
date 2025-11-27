import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import app from "../server"
import { crearLibro } from "../libros/actions/crear.action"

let mongo: MongoMemoryServer
let userId = ""
let token = ""
let libroId = ""

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())

  const user = await request(app).post("/api/usuarios/registrar").send({
    nombre: "Luis",
    email: "luis@test.com",
    password: "123456",
    permisos: {crearLibros: true}
  })

  userId = user.body._id

  const login = await request(app)
    .post("/api/usuarios/login")
    .send({ email: "luis@test.com", password: "123456" })

  token = login.body.token
  
  const libro = await request(app)
    .post("/api/libros/crear")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nombre: "Libro X",
      autor: "Autor Z",
      genero: "Terror",
      fechaPublicacion: "2020-01-01",
      editorial: "Planeta"
    })


  libroId = libro.body._id

})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
})

describe("Controlador Reservas", () => {

  test("Crear reserva", async () => {
    const res = await request(app)
      .post("/api/reservas/reservar")
      .set("Authorization", `Bearer ${token}`)
      .send({
        libroId,
        fechaEntrega: "2025-01-01"
      })
    expect(res.status).toBe(200)
    expect(res.body.libro).toBe(libroId)
  })

  test("Historial por libro", async () => {
    const res = await request(app)
      .get(`/api/reservas/libro/${libroId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body[0].usuario.nombre).toBe("Luis")
  })

  test("Historial por usuario", async () => {
    const res = await request(app)
      .get(`/api/reservas/usuario/${userId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body[0].libro.nombre).toBe("Libro X")
  })

  test("Devolver libro", async () => {
    const res = await request(app)
      .post("/api/reservas/devolver")
      .set("Authorization", `Bearer ${token}`)
      .send({ libroId })

    expect(res.status).toBe(200)
  })

})
