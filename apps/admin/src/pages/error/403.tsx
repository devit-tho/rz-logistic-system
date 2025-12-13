import { Button } from "@/components/ui/button";
import paths from "@/routes/paths";
import { Link } from "react-router-dom";

function Page403() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-y-6 text-center">
        <div>
          <h1 className="text-primary text-9xl font-bold">403</h1>
          <p className="text-2xl font-semibold text-gray-800">
            You don't have permission to access this page
          </p>
        </div>

        <Button asChild>
          <Link to={paths.dashboard.root}>Go back home</Link>
        </Button>
      </div>
    </div>
  );
}

export default Page403;
