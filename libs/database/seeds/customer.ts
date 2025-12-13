import { Prisma } from "../src";

const customer: Omit<Prisma.CustomerCreateManyInput, "userId" | "contactId">[] =
  [
    {
      organization: "Dara",
      email: "dara@email.com",
      phone: "1234567890",
      address: "123 Main St, Phnom Penh, Cambodia",
    },
    {
      organization: "Sokha",
      email: "sokha@email.com",
      phone: "1234567890",
      address: "123 Main St, Phnom Penh, Cambodia",
    },
    {
      organization: "Vanna",
      email: "vanna@email.com",
      phone: "1234567890",
      address: "123 Main St, Phnom Penh, Cambodia",
    },
    {
      organization: "Ravy",
      email: "ravy@email.com",
      phone: "1234567890",
      address: "123 Main St, Phnom Penh, Cambodia",
    },
    {
      organization: "Sarona",
      email: "sarona@email.com",
      phone: "1234567890",
      address: "123 Main St, Phnom Penh, Cambodia",
    },
  ];

export default customer;
