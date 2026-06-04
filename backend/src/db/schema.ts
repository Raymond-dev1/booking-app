import { pgTable, pgEnum, integer, index, uniqueIndex } from "drizzle-orm/pg-core"
import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers.js";

export const rolesEnum  = pgEnum("roles", ["guest", "owner", "staff", "customer"])
export const dayOfTheWeekEnum = pgEnum("day_of_the_week", ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"])
export const bookingStatusEnum =pgEnum("bookingStatus", ["pending",  "confirmed", "cancelled","completed", "no_show"])
export const paymentStatusEnum =pgEnum("paymentStatus", ["unpaid", "paid", "refunded"])
export const paymentTypeEnum = pgEnum("payment_type", ["pay_now", "pay_on_arrival", "free"])

// schema guide
// export  const table name in ts = pgTable(table name in database , {
//     column name in ts : database type ( db column name )
// })


export const users = pgTable('users', {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    first_name: t.varchar("first_name", { length: 256 }),
    last_name: t.varchar("last_name", { length: 256 }),
    email: t.varchar().notNull(),
    phone_number: t.varchar("phone_number", {length:15}),
    invite_token:t.varchar("invite_token", {length:256}),
    password_hash: t.varchar("password_hash"),
    is_active: t.boolean("is_active").default(true),
    role: rolesEnum().default("guest"),
    ...timestamps
}, (table) =>[
    t.uniqueIndex("email_idx").on(table.email)
])

export const businesses = pgTable('businesses', {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar("name", { length: 256 }),
    slug: t.varchar("slug ", { length: 256 }),
    owner_id: t.integer("owner_id").references(() => users.id),
    business_hours: t.jsonb("business_hours").notNull(),
    stripe_account_id: t.varchar("stripe_account_id", { length: 256 }),
    logo: t.varchar('logo', {length: 256}),
    ...timestamps,
}, (table) =>[
    t.uniqueIndex("slug_idx").on(table.slug)
])

export const services = pgTable("services", {
    id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    business_id: t.integer("business_id").references(() => businesses.id),
    name: t.varchar("name", { length: 256}).notNull(),
    description: t.text("description"),
    duration_minutes: t.integer("duration_minutes"),
    buffer_mins: t.integer("buffer_mins").default(0),
    price: t.numeric("price", {precision: 10, scale: 2}),
    payment_type:paymentTypeEnum("payment_type").default("pay_now"),
    is_active: t.boolean("is_active").default(true),
    ...timestamps,
} ,(table) => [
    t.index("business_id_idx").on(table.business_id)
])

export const staff_services = pgTable("staff_services",{
    staff_id: t.integer("staff_id").notNull().references(() => users.id),
    service_id: t.integer("service_id").notNull().references(() => services.id),
}, (table) =>[
    t.primaryKey({columns: [table.staff_id, table.service_id]})
])

export const staff_availability =pgTable("staff_availability", {
    id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    staff_id: t.integer("staff_id").references(() => users.id),
    day_of_the_week: dayOfTheWeekEnum("day_of_the_week").notNull(),
    start_time: t.time("start_time").notNull(),
    end_time: t.time("end_time").notNull()
})

export const bookings =pgTable("bookings", {
    id:t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    business_id: t.integer("business_id").references(()=> businesses.id),
    service_id: t.integer("service_id").references(() => services.id),
    staff_id: t.integer("staff_id").references(() => users.id),
    customer_id: t.integer("customer_id").references(() => users.id),
    guest_email:t.varchar("guest_email", {length:256}),
    guest_phone:t.varchar("guest_phone", {length:20}).notNull(),
    start_time:t.time("start_time").notNull(),
    end_time:t.time("end_time").notNull(),
    status:bookingStatusEnum("status").default("pending"),
    payment_status:paymentStatusEnum("payment_status").default("unpaid"),
    stripe_payment_intent_id: t.varchar("stripe_payment_intent_id", {length:256}),
    cancellation_token:t.uuid("cancellation_token").defaultRandom(),
    deposit_amount:t.numeric("deposit_amount", {precision: 10, scale: 2}),
    ...timestamps,
},(table)=>[
    t.index("business_service_idx").on(table.business_id, table.service_id),
    t.index("staff_availability_idx").on(table.staff_id, table.start_time, table.end_time),
    t.index("customer_bookings_idx").on(table.customer_id, table.start_time, table.end_time),
    t.index("service_idx").on(table.service_id)
])

export const locations =pgTable("locations", {
    id:t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    business_id:t.integer("business_id").references(() => businesses.id),
    name:t.varchar("name", {length:250}),
    address:t.varchar("address", {length:500}),
    is_active:t.boolean("is_active").default(true)
})