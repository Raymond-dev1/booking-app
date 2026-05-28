//owner invites staff --staff accepts invite through mail link --returns token to set password 
// --staff sets password --staff recieves mail of successful registration
import express from "express";
import request from "supertest";
import app from "../app.js";
import dotenv  from "dotenv"

dotenv.config()

jest.setTimeout(15000); 

describe("staff invitation flow", () => {
  let token: string;
  let inviteToken: string;
  
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
    it("sends invite mail when staff is invited successfully", async () => {
        const staffInviteRes = await request(app)
        .post("/staff/invite")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "iziogabraymond@gmail.com",
          first_name: "Ray",
          last_name: "effect",
          phone_number: "09119807654",
        })

        expect(staffInviteRes.statusCode).toEqual(200)
        expect(staffInviteRes.body.message).toEqual("staff invited successfully")
        expect(staffInviteRes.body.inviteToken).toBeDefined()
        expect(staffInviteRes.body.data.email).toEqual("iziogabraymond@gmail.com")

        inviteToken = staffInviteRes.body.inviteToken
    })

    it("activates staff account when valid token and password provided", async () => {
  const res = await request(app)
    .post("/staff/accept")
    .query({ token: inviteToken}) 
    .send({ password: "newpassword123" })

  expect(res.statusCode).toEqual(200)
  expect(res.body.token).toBeDefined()
  expect(res.body.message).toContain("successfully")
  expect(res.body.data.first_name).toEqual("Ray")
})

      afterAll(async () => {
        await request(app)
      .delete("/staff/delete")
      .set("Authorization", `Bearer ${token}`)
})
})
