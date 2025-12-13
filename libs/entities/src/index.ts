import {
  Broker,
  Cargo as CargoPrisma,
  CargoType,
  Contact,
  ContainerSize,
  ContainerType,
  Customer as CustomerPrisma,
  Driver,
  Shipment as ShipmentPrisma,
  ShipmentStatus,
  ShippingLine as ShippingLinePrisma,
  Supplier as SupplierPrisma,
  TruckingManagement as TruckingManagementPrisma,
  TruckingType,
  User,
} from "@monorepo/database";

type UserWithoutPassword = Omit<User, "password">;

type LoginResponse = { user: UserWithoutPassword; token: string };

type Customer = CustomerPrisma & {
  contact: Contact;
};

type Cargo = CargoPrisma & {
  shipment: Pick<Shipment, "name">;
};

type Shipment = ShipmentPrisma & {
  user: Pick<User, "name">;
  broker: Pick<Broker, "name">;
  customer: {
    contact: Pick<Contact, "name">;
  };
  shippingLine: {
    contact: Pick<Contact, "name">;
  };
};

type Supplier = SupplierPrisma & {
  contact: Contact;
};

type ShippingLine = ShippingLinePrisma & {
  contact: Contact;
};

type TruckingManagement = TruckingManagementPrisma & {
  cargo: Pick<Cargo, "name">;
  supplier: Pick<Supplier, "organization">;
  shipment: Pick<Shipment, "name">;
};

type AllCustomers = Pick<Customer, "id" | "organization" | "createdAt">;

type AllCargos = Pick<Cargo, "id" | "name" | "createdAt">;

type AllShippingLines = Pick<ShippingLinePrisma, "id" | "organization">;

type AllBrokers = Pick<Broker, "id" | "name" | "createdAt">;

type AllSuppliers = Pick<Supplier, "id" | "createdAt" | "organization">;

type AllShipments = Pick<Shipment, "id" | "name" | "createdAt">;

type AllTruckingManagements = Pick<
  TruckingManagement,
  "id" | "truckPlateNumber" | "createdAt"
>;

type AllDrivers = Pick<Driver, "id" | "name" | "createdAt">;

interface ReportShipmentData {
  name: string;
  cargos: number;
  truckings: number;
  fee: number;
}
interface ReportShipments {
  shipments: ReportShipmentData[];
  total: {
    cargo: number;
    fee: number;
    trucking: number;
  };
}

const shipmentStatus: Record<ShipmentStatus, ShipmentStatus> = {
  PENDING: "PENDING",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  ON_HOLD: "ON_HOLD",
};

const containerSize: Record<ContainerSize, ContainerSize> = {
  FT20: "FT20",
  FT40: "FT40",
  FT45: "FT45",
};

const containerType: Record<ContainerType, ContainerType> = {
  DRY: "DRY",
  REEFER: "REEFER",
  OPEN_TOP: "OPEN_TOP",
  FLAT_RACK: "FLAT_RACK",
  TANK: "TANK",
};

const cargoType: Record<CargoType, CargoType> = {
  CONTAINER: "CONTAINER",
  BREAK_BULK: "BREAK_BULK",
  OUT_OF_GAUGE: "OUT_OF_GAUGE",
  GENERAL: "GENERAL",
  HAZARDOUS: "HAZARDOUS",
  REFRIGERATED: "REFRIGERATED",
  OVERSIZED: "OVERSIZED",
  LIQUID: "LIQUID",
  FRAGILE: "FRAGILE",
  OTHER: "OTHER",
};

const truckingType: Record<TruckingType, TruckingType> = {
  CONTAINER: "CONTAINER",
  FLATBED: "FLATBED",
  REEFER: "REEFER",
  BOX_TRUCK: "BOX_TRUCK",
  HEAVY_HAUL: "HEAVY_HAUL",
  TIPPER: "TIPPER",
  CAR_CARRIER: "CAR_CARRIER",
  CROSS_BORDER: "CROSS_BORDER",
  LTL: "LTL",
  FTL: "FTL",
  LAST_MILE: "LAST_MILE",
  TANKER: "TANKER",
  LOWBED: "LOWBED",
  SIDE_LOADER: "SIDE_LOADER",
  HOTSHOT: "HOTSHOT",
};

export {
  cargoType,
  containerSize,
  containerType,
  shipmentStatus,
  truckingType,
};

export * from "./pagination";

export type {
  AllBrokers,
  AllCargos,
  AllCustomers,
  AllDrivers,
  AllShipments,
  AllShippingLines,
  AllSuppliers,
  AllTruckingManagements,
  Broker,
  Cargo,
  Customer,
  Driver,
  LoginResponse,
  ReportShipments,
  Shipment,
  ShippingLine,
  Supplier,
  TruckingManagement,
  User,
  UserWithoutPassword,
};
