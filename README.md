## RZ Logistic System

### Description

This is a logistic system that used to track of shipment, trucking, cargo, and other logistic activities. It is a simple and easy-to-use for operations and management.
this project is developed for thesis before gradauted.

### Tech Stack

## Frontend

- React
- Redux
- React-Router-Dom
- TailwindCSS / Shadcn UI
- Typescript
- Zod

## Backend

- NestJS
- Typescript
- PostgreSQL
- Prisma
- Zod

### Installation

```bash
npm install -g yarn
enable corepack
yarn set version berry
yarn install
```

### Environment

Create a `.env` file in the directory such as:

- apps/admin/.env
- apps/backend/.env
- libs/database/.env

for admin and backend you can check at config folder that follow the zod schema.

for database

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rz_logistic_system
```

### Usage

```bash
yarn dev
```

### License

MIT

### Seeding

```bash
yarn workspace @monorepo/database db:seed
```
