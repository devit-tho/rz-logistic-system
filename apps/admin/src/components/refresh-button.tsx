import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function RefreshButton({
  onClick,
  ...other
}: React.ComponentProps<"button">) {
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={onClick} {...other}>
            <RefreshCcw />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Refresh</span>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
