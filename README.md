# Booking-app

### Overview 
This is a multi-tenant booking system which enables any service-based business to onboard, configure their services, manage staff availability, and accept appointments.

The product is a booking infrastructure tailored to service providers.
>Just like Shopify - e-commerce, Spotify - artists and audio-related  creators.
>The product can also be categorized under "Horizontal SaaS" --[A SaaS tailored to multiple niches rather than one niche]

## Purpose
This project was mainly developed for familiarity with production-level systems and tools alongside several reasons as follows; 
- Proficiency with Typescript:- The project incorporates structural and strict typing to disapprove excessive use of "any" and catch runtime bugs, which improves security and performance overall. 
   - With features visible in services like auth and RBAC [Enums, typed JWT Payloads]
   - services[union types, zod validation]
   - Availability engine [utility & date /time types]
   - Booking state machine[Discriminated unions, type narrowing]

- Production-grade tools & concepts:- From observability to idempotency to concurrency, it allows the implementation of these distributed system concepts, without overengineering the actual project 

- Solid software architectural decisions:- With efficient system design expanding from the staff onboarding feature to the staff availability engine to the booking engine. The project helps reinforce the ability to think about systems.

## How does it work ?
 Entities
  - Owner
  - customer
  - staff
  - guest

### User Journey
- Onwer creates business --  creates service --  onboards staff -- assign staff to service -- manages bookings, staff and services.
- Staff --- sets availability --- deliver bookings -- manages upcoming bookings
- customer -- books staff -- review past bookings 
- Guest --- books staff -- view past bookings with email

### Layers
This project covers layers such as server , Auth,  Database[PostgreSQL], inputs validation , Email delivery, Concurrency, Duplicate booking prevention. 
