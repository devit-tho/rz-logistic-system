import { useShipmentReports } from "@/api";
import { LoadingScreen } from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { activityHelper } from "@/utils/activity-helper";
import { capitalCase } from "change-case";
import { Printer } from "lucide-react";
import { Activity, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const REPORTS_DATE_FILTER = {
  month: "month",
  "3-month": "3-month",
  year: "year",
};

function ReportPage() {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [date, setDate] = useState<"month" | "3-month" | "year">("month");

  const { reportsData, reportsLoading, reportsTotal, reportsEmpty } =
    useShipmentReports(date);

  return (
    <>
      <div className="mx-auto size-full max-w-screen-lg space-y-3">
        <div className="bg-muted flex items-center justify-between rounded-lg p-1">
          <div className="flex gap-x-2">
            <Tabs defaultValue="month">
              <TabsList>
                {Object.values(REPORTS_DATE_FILTER).map((filter) => (
                  <TabsTrigger
                    key={filter}
                    value={filter}
                    onClick={() =>
                      setDate(filter as keyof typeof REPORTS_DATE_FILTER)
                    }
                  >
                    {capitalCase(filter)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.values(REPORTS_DATE_FILTER).map((filter) => (
                <TabsContent
                  key={filter}
                  value={filter}
                  className="hidden"
                ></TabsContent>
              ))}
            </Tabs>
          </div>

          <Tooltip>
            <Button variant="ghost" onClick={reactToPrintFn}>
              <Printer />
            </Button>
          </Tooltip>
        </div>

        <div className="h-full max-h-[calc(100%-60px)] shadow-lg">
          <div
            ref={contentRef}
            className="flex h-full flex-col gap-y-4 bg-white px-5 py-3 print:flex print:min-h-full print:flex-col"
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src="/images/logo.png"
                  alt="logo"
                  className="h-34 w-52 object-cover"
                />
              </div>
            </div>

            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Shipment Name</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Trucking</TableHead>
                  <TableHead>Trucking Expense</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Activity
                  name="data-display"
                  mode={activityHelper(!reportsLoading && !reportsEmpty)}
                >
                  {reportsData.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{report.cargos}</TableCell>
                      <TableCell>{report.truckings}</TableCell>
                      <TableCell>{report.fee}</TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell className="font-medium"></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Grand Total:</TableCell>
                    <TableCell>{reportsTotal?.trucking}</TableCell>
                    <TableCell>{reportsTotal?.fee}</TableCell>
                  </TableRow>
                </Activity>

                <Activity name="loading" mode={activityHelper(reportsLoading)}>
                  <TableRow className="h-[40dvh]">
                    <TableCell colSpan={5} className="text-center">
                      <LoadingScreen />
                    </TableCell>
                  </TableRow>
                </Activity>

                <Activity
                  name="no-data"
                  mode={activityHelper(!reportsLoading && reportsEmpty)}
                >
                  <TableRow className="h-[40dvh]">
                    <TableCell colSpan={5} className="text-center">
                      No data
                    </TableCell>
                  </TableRow>
                </Activity>
              </TableBody>
            </Table>

            {/* <div className="mt-auto flex gap-x-5 border-t-5 border-black/90 py-2 text-sm print:relative print:mt-[65vh]">
              <span className="basis-2/5">
                Address: #C14, National Road 3, Phum Prey, Chom Chao Commune,
                Posenchey District, Phnom Penh
              </span>
              <span>Tel: 855-86 777 308</span>
              <span>
                Email: info@rz-cambodia.com <br />
              </span>
              <span>Website: www.RZ-cambodia.com</span>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportPage;
