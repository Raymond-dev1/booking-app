//owner invites staff --staff accepts invite through mail link --returns token to set password
// --staff sets password --staff recieves mail of successful registration
import express from "express";
import request from "supertest";
import app from "../app.js";
import dotenv from "dotenv";

dotenv.config();

jest.setTimeout(15000);

// TESTS STAFF INVITATION FLOW
describe.skip("staff invitation flow", () => {
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
        role: "owner",
      });
    token = registerRes.body.token;
  });
  it("sends invite mail when staff is invited successfully", async () => {
    const staffInviteRes = await request(app)
      .post("/staff/invite")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "iziogabraymond@gmail.com",
        first_name: "Ray",
        last_name: "effect",
        phone_number: "09119807654",
      });

    expect(staffInviteRes.statusCode).toEqual(200);
    expect(staffInviteRes.body.message).toEqual("staff invited successfully");
    expect(staffInviteRes.body.inviteToken).toBeDefined();
    expect(staffInviteRes.body.data.email).toEqual("iziogabraymond@gmail.com");

    inviteToken = staffInviteRes.body.inviteToken;
  });

  it("activates staff account when valid token and password provided", async () => {
    const res = await request(app)
      .post("/staff/accept")
      .query({ token: inviteToken })
      .send({ password: "newpassword123" });

    console.log("test staff_id;", res.body.data.id);

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toContain("successfully");
    expect(res.body.data.first_name).toEqual("Ray");
  });

  afterAll(async () => {
    await request(app)
      .delete("/staff/delete")
      .set("Authorization", `Bearer ${token}`);
  });
});

// TESTS STAFF DEACTIVATION
describe.skip("deactivates staff", () => {
  let token: string;

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
  });

  it("deactivates staff with id params successfully", async () => {
    const staff = await request(app)
      .post("/staff/deactivate/57")
      .set("Authorization", `Bearer ${token}`);

    expect(staff.statusCode).toEqual(200);
    expect(staff.body.message).toContain("deactivated");
  });
});

//TESTS STAFF ASSIGNMENT
describe("staff to service assignment", () => {
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

    const res = await request(app)
      .post("/business/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "koe",
        business_hours: { mon: { open: "09:00", close: "17:00" } },
        logo: "koenvrenernfdoe44examplejnfvom",
      });
    businessId = res.body.data.id;

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
    serviceId = serviceRes.body.data.id;
  });
  it("assigns staff to service successfully", async () => {
    const res = await request(app)
      .post(`/staff/assign/${serviceId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        staffId: 57,
        businessId,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.staff_id).toBeDefined();
    expect(res.body.data.service_id).toBeDefined();
  });

  it("fetches staff by service successfully", async () => {
    const res = await request(app)
      .get(`/staff/${serviceId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.first_name).toBe("Ray");
    expect(res.body.data.last_name).toBe("effect");
  });
});


