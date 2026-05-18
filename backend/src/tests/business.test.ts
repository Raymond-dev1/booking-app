import express from "express";
import request from "supertest";
import app from "../app.js";
import { accessToken } from "../services/token.service.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { businesses } from "../db/schema.js";
import dotenv  from "dotenv"

dotenv.config()

const router = express.Router();

jest.setTimeout(15000); 

describe("POST /business/register", () => {
  it("returns status code 201 if business is created successfully", async () => {
    
    const registerRes = await request(app)
      .post("/auth/register")
      .send({ 
        first_name: "John", 
        last_name: "Doe", 
        email: `ownertestser@test.com`, 
        password: "password123", 
        role: "owner" 
      })

    const token = registerRes.body.token

    const res = await request(app)
      .post("/business/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "koe",
        business_hours: { mon: { open: "09:00", close: "17:00" } },
        logo: "koenvrenernfdoe44examplejnfvom",
      })

    expect(res.statusCode).toEqual(201)
    expect(res.body.data.name).toEqual("koe")

  })
})


// describe("POST /business/retrieve", () => {
//   it("returns status code 200 if business is retrieved successfully", async () => {

//         const loginRes = await request(app)
//       .post("/auth/login")
//       .send({ 
//         email: `ownertestser@test.com`, 
//         password: "password123", 
//       })

//     const token = loginRes.body.token

//     const id = loginRes.body.data?.id
//     const res = await request(app)
//       .get(`/business/retrieve?id=${id}`)
//       .set("Authorization", `Bearer ${token}`)

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.data.name).toEqual("koe")
//   });
// });

