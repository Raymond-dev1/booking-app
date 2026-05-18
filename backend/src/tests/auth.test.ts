import express from "express";
import request from "supertest";
import app from "../app.js";

const router = express.Router();

jest.setTimeout(15000); 

describe("POST /auth/register", () => {
  it.skip("returns status code 201 if user is created successfully", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        first_name: "koe",
        last_name: "doe",
        email: "koe.doe@example.com",
        password: "password223",
        role: "customer"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.role).toEqual("customer");
  });
});

describe("POST /auth/login", () => {
  it.skip("returns status code 200 if user logged in successfuly", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "john.doe@example.com",
        password: "password123",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.role).toEqual("customer");
    expect(res.body.token).toBeDefined()
  });
});

// describe('sanity check', () => {
//   it('should pass', () => {
//     expect(1 + 1).toBe(2)
//   })
// })
