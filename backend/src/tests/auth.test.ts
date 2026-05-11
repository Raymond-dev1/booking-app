import express from "express";
import request from "supertest";
import app from "../app.js";

const router = express.Router();

jest.setTimeout(15000); 

describe("POST /auth/register-customer", () => {
  it("returns status code 201 if first name is passed", async () => {
    const res = await request(app)
      .post("/auth/register-customer")
      .send({
        first_name: "john",
        last_name: "doe",
        email: "john.doe@example.com",
        password: "password123",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.role).toEqual("customer");
  });
});


// describe('sanity check', () => {
//   it('should pass', () => {
//     expect(1 + 1).toBe(2)
//   })
// })
