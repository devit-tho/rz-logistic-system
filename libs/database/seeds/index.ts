import * as dotenv from "dotenv";
import prisma, { Prisma } from "../src";

// seed file
import brokers from "./broker";
import cargos from "./cargo";
import contacts from "./contact";
import customers from "./customer";
import drivers from "./driver";
import shipments from "./shipments";
import shippingLines from "./shipping-line";
import suppliers from "./supplier";
import truckings from "./trucking";
import users from "./user";

dotenv.config({ path: ".env.development" });

async function main() {
  await prisma.$transaction(async (ctx) => {
    let curIndexContactId = 0;
    // Clear existing data
    // await ctx.broker.deleteMany();
    // await ctx.user.deleteMany();
    // await ctx.token.deleteMany();
    // await ctx.shipment.deleteMany();
    // await ctx.truckingManagement.deleteMany();
    // await ctx.cargo.deleteMany();
    // await ctx.supplier.deleteMany();
    // await ctx.shippingLine.deleteMany();
    // await ctx.customer.deleteMany();

    await ctx.user.createMany({
      data: users,
    });

    const usersId = (
      await ctx.user.findMany({
        select: {
          id: true,
        },
      })
    ).map((user) => user.id);

    await ctx.contact.createMany({ data: contacts });

    const contactQueue: string[] = (
      await ctx.contact.findMany({
        select: { id: true },
      })
    ).map((c) => c.id);

    function takeContactId(): string {
      const id = contactQueue.shift();
      if (!id) {
        throw new Error("Not enough Contact records for 1-to-1 relation");
      }
      return id;
    }

    console.log(`${usersId.length} users seeded.`);

    await ctx.broker.createMany({
      data: brokers.map((broker) => ({
        ...broker,
        userId: usersId[Math.floor(Math.random() * usersId.length)],
      })),
    });
    console.log(`${brokers.length} brokers seeded.`);

    await ctx.customer.createMany({
      data: customers.map((customer) => {
        const index = curIndexContactId;
        curIndexContactId++;
        return {
          ...customer,
          contactId: takeContactId(),
          userId: usersId[Math.floor(Math.random() * usersId.length)],
        };
      }),
    });

    const customersId = (
      await ctx.customer.findMany({
        select: {
          id: true,
          userId: true,
        },
      })
    ).map((customer) => ({ id: customer.id, userId: customer.userId }));

    console.log(`${customersId.length} customers seeded.`);

    await ctx.supplier.createMany({
      data: suppliers.map((supplier) => {
        const index = curIndexContactId;
        curIndexContactId++;
        return {
          ...supplier,
          userId: usersId[Math.floor(Math.random() * usersId.length)],
          contactId: takeContactId(),
        };
      }),
    });

    const suppliersId = (
      await ctx.supplier.findMany({
        select: {
          id: true,
          userId: true,
        },
      })
    ).map((supplier) => ({ id: supplier.id, userId: supplier.userId }));

    console.log(`${suppliersId.length} suppliers seeded.`);

    await ctx.shippingLine.createMany({
      data: shippingLines.map((shippingLine) => {
        const index = curIndexContactId;
        curIndexContactId++;
        return {
          ...shippingLine,
          userId: usersId[Math.floor(Math.random() * usersId.length)],
          contactId: takeContactId(),
        };
      }),
    });

    const shippingLinesId = (
      await ctx.shippingLine.findMany({
        select: {
          id: true,
          userId: true,
        },
      })
    ).map((shippingLine) => ({
      id: shippingLine.id,
      userId: shippingLine.userId,
    }));

    console.log(`${shippingLinesId.length} shipping lines seeded.`);

    await ctx.shipment.createMany({
      data: shipments.map((shipment) => ({
        ...shipment,
        userId:
          customersId[Math.floor(Math.random() * customersId.length)].userId,
        customerId:
          customersId[Math.floor(Math.random() * customersId.length)].id,
      })),
    });

    const shipmentsId = await ctx.shipment.findMany({
      select: {
        id: true,
        userId: true,
      },
    });

    console.log(`${shipments.length} shipments seeded.`);

    await ctx.cargo.createMany({
      data: cargos.map<Prisma.CargoCreateManyInput>((cargo) => ({
        ...cargo,
        userId: usersId[Math.floor(Math.random() * usersId.length)],
        shipmentId:
          shipmentsId[Math.floor(Math.random() * shipmentsId.length)].id,
      })),
    });

    const cargosId = (
      await ctx.cargo.findMany({
        select: {
          id: true,
          userId: true,
        },
      })
    ).map((cargo) => ({ id: cargo.id, userId: cargo.userId }));

    console.log(`${cargosId.length} cargos seeded.`);

    await ctx.driver.createMany({
      data: drivers,
    });

    const driversId = (
      await ctx.driver.findMany({
        select: {
          id: true,
        },
      })
    ).map((driver) => driver.id);

    console.log(`${driversId.length} drivers seeded.`);

    await ctx.truckingManagement.createMany({
      data: truckings.map<Prisma.TruckingManagementCreateManyInput>(
        (trucking) => ({
          ...trucking,
          userId: usersId[Math.floor(Math.random() * usersId.length)],
          cargoId: cargosId[Math.floor(Math.random() * cargosId.length)].id,
          supplierId:
            suppliersId[Math.floor(Math.random() * suppliersId.length)].id,
          shipmentId:
            shipmentsId[Math.floor(Math.random() * shipmentsId.length)].id,
          driverId: driversId[Math.floor(Math.random() * driversId.length)],
        })
      ),
    });

    console.log(`${truckings.length} truckings seeded.`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
