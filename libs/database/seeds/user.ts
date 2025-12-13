import { Prisma } from "../src";

const user: Prisma.UserCreateManyInput[] = [
  {
    name: "Sarona Admin",
    email: "sarona-admin@email.com",
    password: "$2a$10$/IBBmBzpI3zxgnx0ZNpzRudMcLcJ3Fi3uv9LW.Ryc.LvWLqSEgl9W",
    imageUrl: "https://avatars.githubusercontent.com/u/101364760?v=4",
    isSuperAdmin: true,
  },
  {
    name: "Sarona",
    email: "sarona@email.com",
    password: "$2a$10$/IBBmBzpI3zxgnx0ZNpzRudMcLcJ3Fi3uv9LW.Ryc.LvWLqSEgl9W",
    imageUrl: "https://avatars.githubusercontent.com/u/101364760?v=4",
    isSuperAdmin: false,
  },
];

export default user;
