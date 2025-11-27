import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import app from "../server"

let mongo: MongoMemoryServer
let userId = ""
let userId2 = ""
let token = ""

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
})

describe("Controlador de Usuarios", () => {

  test("Registrar usuario", async () => {
    const res = await request(app)
      .post("/api/usuarios/registrar")
      .send({
        nombre: "Juan",
        email: "juan@test.com",
        password: "123456"
      })

    expect(res.status).toBe(200)
    userId = res.body._id
  })

  test("Registrar usuario2", async () => {
    const res = await request(app)
      .post("/api/usuarios/registrar")
      .send({
        nombre: "Juan2",
        email: "juan2@test.com",
        password: "123456"
      })

    expect(res.status).toBe(200)
    userId2 = res.body._id
  })

  test("Login email incorrecto", async () =>{
    const res = await request(app)
      .post("/api/usuarios/login")
      .send({
        email: "juan3@test.com",
        password: "123456"
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe("Usuario no encontrado")
  })

  test("Login contraseña incorrecta", async () =>{
    const res = await request(app)
      .post("/api/usuarios/login")
      .send({
        email: "juan@test.com",
        password: "1234567"
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe("Credenciales inválidas")
  })

  test("Login usuario", async () => {
    const res = await request(app)
      .post("/api/usuarios/login")
      .send({
        email: "juan@test.com",
        password: "123456"
      })

    expect(res.status).toBe(200)
    token = res.body.token
  })

  test("Obtener usuario por ID propio", async () => {
    const res = await request(app)
      .get(`/api/usuarios/buscar/${userId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe("juan@test.com")
  })

  test("Obtener usuario por ID sin permiso", async () => {
    const res = await request(app)
      .get(`/api/usuarios/buscar/${userId2}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(403)
    expect(res.body.error).toBe("No tienes permisos para realizar esta acción")
  })

  test("Actualizar usuario sin permiso", async () => {
    const res = await request(app)
      .put(`/api/usuarios/actualizar/${userId2}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Juanito", permisos: {modificarUsuarios: true,inhabilitarUsuarios: true, verUsuarios: true} })

    expect(res.status).toBe(403)
    expect(res.body.error).toBe("No tienes permisos para realizar esta acción")
  })
  
  test("Eliminar usuario sin permiso", async () => {
    const res = await request(app)
      .delete(`/api/usuarios/eliminar/${userId2}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(403)
    expect(res.body.error).toBe("No tienes permisos para realizar esta acción")
  })

  test("Actualizar usuario(Myself)", async () => {
    const res = await request(app)
      .put(`/api/usuarios/actualizar/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Juanito", permisos: {modificarUsuarios: true,inhabilitarUsuarios: true, verUsuarios: true} })

    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe("Juanito")
  })

   test("Actualizar usuario con permiso", async () => {
    const res = await request(app)
      .put(`/api/usuarios/actualizar/${userId2}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Juanito", permisos: {modificarUsuarios: true,inhabilitarUsuarios: true, verUsuarios: true} })

    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe("Juanito")
  })
  
  test("Obtener usuario por ID con permiso", async () => {
    const res = await request(app)
      .get(`/api/usuarios/buscar/${userId2}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body._id).toBe(userId2)
  })

  test("Eliminar usuario con permiso", async () => {
    const res = await request(app)
      .delete(`/api/usuarios/eliminar/${userId2}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.mensaje).toBe("Usuario inhabilitado")
  })

  test("Eliminar usuario(Myself)", async () => {
    const res = await request(app)
      .delete(`/api/usuarios/eliminar/${userId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.mensaje).toBe("Usuario inhabilitado")
  })
})
