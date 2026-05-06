import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users } from './db/schema.js'; 
import { neon } from "@neondatabase/serverless";
import {config } from 'dotenv';
config()

const sql =neon(process.env.DATABASE_URL! );
const db = drizzle({client: sql})

async function testConnection() {
  console.log('--- CREATE ---');
  const inserted = await db.insert(users).values({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    password_hash: 'hashedpassword123',
    is_active: true,
    role: 'guest',
  }).returning();

  console.log('Inserted:', inserted[0]);
  const userId = inserted[0]!.id;

  console.log('\n--- RETRIEVE ---');
  const found = await db.select().from(users).where(eq(users.id, userId));
  console.log('Found:', found[0]);

  console.log('\n--- DELETE ---');
  const deleted = await db.delete(users).where(eq(users.id, userId)).returning();
  console.log('Deleted:', deleted[0]);

  console.log('\n✅ Connection confirmed, all good.');
  process.exit(0);
}

testConnection().catch((err) => {
  console.error('❌ Connection failed:', err);
  process.exit(1);
});