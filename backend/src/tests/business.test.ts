import express from "express";
import request from "supertest";
import app from "../app.js";
import { accessToken } from "../services/token.service.js";
import dotenv  from "dotenv"

dotenv.config()

const router = express.Router();

jest.setTimeout(15000); 

describe.skip("POST /business/register", () => {
  it.skip("returns status code 201 if business is created successfully", async () => {
    
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


//retrieve business with user id 
describe.skip("GET /business/retrieve", () => {

  let token: string
    let id: number

    //register user and business to gen. token 
    beforeAll(async () => {
      const registerRes = await request(app)
      .post("/auth/register")
      .send({ 
        first_name: "John",
        last_name: "Doe",
        email: `owner_${Date.now()}@test.com`, 
        password: "password123",
        role: "owner" 
      })

       token = registerRes.body.token
      console.log("test-user id;", registerRes.body.data.id)
       
       const businessRes= await request(app)
       .post("/business/register")
       .set("Authorization", `Bearer ${token}`)
       .send({
        name: "kos",
        business_hours: { mon: { open: "09:00", close: "17:00" } },
        logo: "koenvrenernfdoe44examplejnfvom",
      })

      id = businessRes.body.data.owner_id
      console.log('businessId;', id)
    })

    //sends owner id to retrieve business 
  it.skip("returns status code 200 if business is retrieved successfully", async () => {

    const res = await request(app)
      .get(`/business/retrieve?id=${id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.name).toEqual("kos")
  });
});

//Tests business fetch 
describe.skip("GET /business/retrieve",  () => {
  it("returns status code 401 if no token is provided", async() => {
    const res =await request (app)
    .get("/business/retrieve")
    
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain("unauthorized")
  });
})

//Deletes business test data 
describe.skip("DELETE /business/delete-all",  () => {
  let token : string

      beforeAll(async () => {
      const registerRes = await request(app)
      .post("/auth/register")
      .send({ 
        first_name: "John",
        last_name: "Doe",
        email: `owner_${Date.now()}@test.com`, 
        password: "password123",
        role: "owner" 
      })

       token = registerRes.body.token
})
  it("returns status code 200 if business is deleted successfully", async() => {
    const res =await request (app)
    .delete("/business/delete-all")
    .set("Authorization", `Bearer ${token}`)
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("Business deleted successfully")
  });
})
