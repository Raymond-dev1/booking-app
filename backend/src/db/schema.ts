import { pgTable, pgEnum, integer, index, uniqueIndex } from "drizzle-orm/pg-core"
import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers.js";

export const rolesEnum  = pgEnum("roles", ["guest", "owner", "staff", "customer"])
// schema guide
// export  const table name in ts = pgTable(table name in database , {
//     column name in ts : database type ( db column name )
// })


export const users = pgTable('users', {
     id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    firstName: t.varchar("first_name", { length: 256 }),
    lastName: t.varchar("last_name", { length: 256 }),
    email: t.varchar().notNull(),
    password_hash: t.varchar("password_hash"),
    is_active: t.boolean("is_active").default(true),
    role: rolesEnum().default("guest"),
    ...timestamps
}, (table) =>[
    t.uniqueIndex("email_idx").on(table.email)
])