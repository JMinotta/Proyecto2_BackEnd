import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import app from "../server"

let mongo: MongoMemoryServer
let userId = ""
let token = ""
let libroId = ""
let libroId2 = ""
let libroId3 = ""

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

      
  const libro2 = await request(app)
    .post("/api/libros/crear")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nombre: "Libro X2",
      autor: "Autor Z2",
      genero: "Terror",
      fechaPublicacion: "2020-01-01",
      editorial: "Planeta2",
      activo:false
    })

    
  const libro3 = await request(app)
    .post("/api/libros/crear")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nombre: "Libro X3",
      autor: "Autor Z3",
      genero: "Terror",
      fechaPublicacion: "2020-01-01",
      editorial: "Planeta3",
      disponible: false
    })

  libroId = libro.body._id
  libroId2 = libro2.body._id
  libroId3 = libro3.body._id

})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
})

describe("Controlador Reservas", () => {


  test("Crear reserva con id falso", async () => {
    const res = await request(app)
      .post("/api/reservas/reservar")
      .set("Authorization", `Bearer ${token}`)
      .send({
        libroId:"69276947216bb2c11954712c",
        fechaEntrega: "2025-01-01"
      })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe("Libro no encontrado")
  })

  test("Crear reserva con libro no activo", async () => {
    const res = await request(app)
      .post("/api/reservas/reservar")
      .set("Authorization", `Bearer ${token}`)
      .send({
        libroId:libroId2,
        fechaEntrega: "2025-01-01"
      })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe("El libro no está activo")
  })

    test("Crear reserva con libro no disponible", async () => {
    const res = await request(app)
      .post("/api/reservas/reservar")
      .set("Authorization", `Bearer ${token}`)
      .send({
        libroId:libroId3,
        fechaEntrega: "2025-01-01"
      })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe("El libro no está disponible")
  })

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

  test("Crear reserva luego de reservar este mismo", async () => {
    const res = await request(app)
      .post("/api/reservas/reservar")
      .set("Authorization", `Bearer ${token}`)
      .send({
        libroId,
        fechaEntrega: "2025-01-01"
      })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe("El libro no está disponible")
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
  
  test("Volver a crear reserva luego de devolver este mismo", async () => {
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

})
