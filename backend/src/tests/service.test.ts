import express from "express";
import request from "supertest";
import app from "../app.js";
import dotenv from "dotenv";

dotenv.config();

jest.setTimeout(15000);

describe("Service  flow",  () => {
  let token: string;
  let serviceId: number;
  let businessId: number;

  beforeAll(async () => {
    const registerRes = await request(app)
      .post("/auth/register")
      .send({
        first_name: "John",
        last_name: "Doe",
        email: `owner_${Date.now()}@test.com`,
        password: "password123",
        role: "owner",
      });
    token = registerRes.body.token;

    const businessRes = await request(app)
      .post("/business/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "lpou",
        business_hours: { mon: { open: "09:00", close: "17:00" } },
        logo: "koenvrenernfdoe44examplejnfvom",
      });
    businessId = businessRes.body.data.id;
    console.log("Business ID:", businessId);
  });

  it("creates service successfully", async () => {
    const serviceRes = await request(app)
      .post("/service/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Haircut",
        duration_minutes: 25,
        buffer_mins: 7,
        price: "2000.00",
        description: "A simple haircut service for men and young adults",
        payment_type: "pay_on_arrival",
      });
      console.log("service;", serviceRes.body)
      serviceId = serviceRes.body.data.id
      console.log("serviceId;", serviceId)

    expect(serviceRes.statusCode).toEqual(200);
    expect(serviceRes.body.message).toContain("successfully");
    expect(serviceRes.body.data.name).toEqual("Haircut");
    expect(serviceRes.body.data.price).toEqual("2000.00");
    expect(serviceRes.body.data.description).toContain("young adults");
  });

  it("deletes service successfully", async () => {
    const deleteRes =await request(app)
    .delete(`/service/delete/${serviceId}`)
    .set("Authorization", `Bearer ${token}`)

    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body.message).toContain("deleted successfully")
  })

  afterAll(async () => {
    await request(app)
      .delete(`/service/delete`)
      .set("Authorization", `Bearer ${token}`);
  });
});

// describe("")
