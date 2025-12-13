import { Prisma } from "../src";

const suppliers: Omit<
  Prisma.SupplierCreateManyInput,
  "userId" | "contactId"
>[] = [
  {
    organization: "Angkor Trading Co.",
    email: "info@angkorsupply.com",
    phone: "+855 23 456 789",
    address: "No. 12, Street 200, Phnom Penh, Cambodia",
  },
  {
    organization: "Mekong Logistics Ltd.",
    email: "support@mekonglogistics.com",
    phone: "+855 23 987 654",
    address: "No. 88, Mao Tse Toung Blvd, Phnom Penh, Cambodia",
  },
  {
    organization: "Tonle Sap Exports",
    email: "sales@tonlesapexports.com",
    phone: "+855 23 222 111",
    address: "No. 5, Street 310, Siem Reap, Cambodia",
  },
  {
    organization: "Golden Palm Supplies",
    email: "hello@goldenpalm.com",
    phone: "+855 23 333 444",
    address: "No. 77, Street 123, Battambang, Cambodia",
  },
  {
    organization: "Khmer Agro Imports",
    email: "contact@khmeragro.com",
    phone: "+855 23 666 555",
    address: "No. 9, National Road 6A, Phnom Penh, Cambodia",
  },
  {
    organization: "Lotus Manufacturing",
    email: "lotus@manufacturing.com",
    phone: "+855 23 777 888",
    address: "No. 24, Street 101, Kampot, Cambodia",
  },
  {
    organization: "Emerald Distribution",
    email: "emerald@distribution.com",
    phone: "+855 23 999 000",
    address: "No. 42, Street 222, Phnom Penh, Cambodia",
  },
  {
    organization: "Silver Star Trading",
    email: "contact@silverstar.com",
    phone: "+855 23 135 246",
    address: "No. 3A, Street 456, Sihanoukville, Cambodia",
  },
  {
    organization: "Angkor Wat Foods",
    email: "foods@angkorwat.com",
    phone: "+855 23 654 987",
    address: "No. 14, Riverside Blvd, Siem Reap, Cambodia",
  },
  {
    organization: "Cambodia Fresh Supply",
    email: "fresh@cambodiasupply.com",
    phone: "+855 23 111 999",
    address: "No. 65, Central Market, Phnom Penh, Cambodia",
  },
];

export default suppliers;
