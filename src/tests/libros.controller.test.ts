import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import app from "../server"

let mongo: MongoMemoryServer
let token = ""
let token2 = ""
let libroId = ""

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())


  await request(app).post("/api/usuarios/registrar").send({
    nombre: "Admin",
    email: "admin@test.com",
    password: "123456",
    permisos: {
      crearLibros: true,
      modificarLibros: true,
      borrarLibros: true,
    }
  })
  
  await request(app).post("/api/usuarios/registrar").send({
    nombre: "Admin2",
    email: "admin2@test.com",
    password: "123456",
    permisos: {
      crearLibros: false,
      modificarLibros: false,
      borrarLibros: false,
    }
  })

  const login = await request(app)
    .post("/api/usuarios/login")
    .send({ email: "admin@test.com", password: "123456" })
  
  const login2 = await request(app)
    .post("/api/usuarios/login")
    .send({ email: "admin2@test.com", password: "123456" })
  
  token = login.body.token
  token2 = login2.body.token
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
})

describe("Controlador Libros", () => {
  
  test("Crear libro sin permiso", async () => {
    const res = await request(app)
      .post("/api/libros/crear")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        nombre: "Libro X",
        autor: "Autor Z",
        genero: "Terror",
        fechaPublicacion: "2020-01-01",
        editorial: "Planeta"
      })

    expect(res.status).toBe(403)
    expect(res.body.error).toBe("No tienes permisos para realizar esta acción")
  })

  test("Crear libro", async () => {
    const res = await request(app)
      .post("/api/libros/crear")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "Libro X",
        autor: "Autor Z",
        genero: "Terror",
        fechaPublicacion: "2020-01-01",
        editorial: "Planeta"
      })

    expect(res.status).toBe(200)
    libroId = res.body._id
  })
    test("Buscar varios libros con filtros", async () => {
    const res = await request(app)
        .get("/api/libros/buscar")
        .query({ genero: "Terror" })

    expect(res.status).toBe(200)

    expect(res.body).toHaveProperty("paginaActual")
    expect(res.body).toHaveProperty("paginaMaxima")
    expect(res.body).toHaveProperty("librosPorPagina")
    expect(res.body).toHaveProperty("resultados")


    expect(Array.isArray(res.body.resultados)).toBe(true)
    expect(res.body.resultados.length).toBe(1)
    expect(res.body.resultados[0].nombre).toBe("Libro X")
    })
        
  test("Buscar un libro por ID", async () => {
    const res = await request(app)
        .get(`/api/libros/buscar/${libroId}`)

    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe("Libro X")
    })

  test("Actualizar libro sin permiso", async () => {
    const res = await request(app)
      .put(`/api/libros/actualizar/${libroId}`)
      .set("Authorization", `Bearer ${token2}`)
      .send({ nombre: "Libro Editado" })

    expect(res.status).toBe(403)
    expect(res.body.error).toBe("No tienes permisos para realizar esta acción")
  })

  test("Actualizar libro", async () => {
    const res = await request(app)
      .put(`/api/libros/actualizar/${libroId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Libro Editado" })

    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe("Libro Editado")
  })

  test("Eliminar libro", async () => {
    const res = await request(app)
      .delete(`/api/libros/eliminar/${libroId}`)
      .set("Authorization", `Bearer ${token2}`)

    expect(res.status).toBe(403)
    expect(res.body.error).toBe("No tienes permisos para realizar esta acción")
  })

  test("Eliminar libro", async () => {
    const res = await request(app)
      .delete(`/api/libros/eliminar/${libroId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.mensaje).toBe("Libro inhabilitado")
  })

})
