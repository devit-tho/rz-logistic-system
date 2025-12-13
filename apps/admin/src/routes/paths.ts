export enum AuthPath {
  ROOT = "auth",
  LOGIN = "login",
  REGISTER = "register",
}

export enum DashboardPath {
  ROOT = "dashboard",
  SHIPMENT = "shipment",
  CARGO = "cargo",
  DRIVER = "driver",
  SHIPPING_LINE = "shipping-line",
  TRUCKING_MANAGEMENT = "trucking-management",
  SUPPLIER = "supplier",
  CUSTOMER = "customer",
  BROKER = "broker",
  USER = "user",
  REPORT = "report",

  SETTINGS = "settings",
}

const dashboardPath = {
  root: `/${DashboardPath.ROOT}`,
  shipment: {
    root: `/${DashboardPath.ROOT}/${DashboardPath.SHIPMENT}`,
  },
  cargo: {
    root: `/${DashboardPath.ROOT}/${DashboardPath.CARGO}`,
  },
  driver: {
    root: `/${DashboardPath.ROOT}/${DashboardPath.DRIVER}`,
  },
  shippingLine: {
    root: `/${DashboardPath.ROOT}/${DashboardPath.SHIPPING_LINE}`,
  },
  truckingManagement: {
    root: `/${DashboardPath.ROOT}/${DashboardPath.TRUCKING_MANAGEMENT}`,
  },
  supplier: {
    root: `/${DashboardPath.ROOT}/${DashboardPath.SUPPLIER}`,
  },
  customer: {
    root: `/${DashboardPath.ROOT}/${DashboardPath.CUSTOMER}`,
  },
  broker: `/${DashboardPath.ROOT}/${DashboardPath.BROKER}`,
  user: `/${DashboardPath.ROOT}/${DashboardPath.USER}`,
  report: `/${DashboardPath.ROOT}/${DashboardPath.REPORT}`,

  // SEPERATE ROUTE WITHOUT SIDE LIST
  settings: `/${DashboardPath.ROOT}/${DashboardPath.SETTINGS}`,
};

const authPath = {
  root: `/${AuthPath.ROOT}`,
  login: `/${AuthPath.ROOT}/${AuthPath.LOGIN}`,
  register: `/${AuthPath.ROOT}/${AuthPath.REGISTER}`,
};

const basePath = {
  root: "/",
  403: "/403",
  404: "/404",
};

export default {
  base: basePath,
  auth: authPath,
  dashboard: dashboardPath,
};
