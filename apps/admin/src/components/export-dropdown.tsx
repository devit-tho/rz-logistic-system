import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download } from "lucide-react";

interface ExportDropdownProps {
  excel?: () => void;
  pdf?: () => void;
}

export function ExportDropdown({ excel, pdf }: ExportDropdownProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download />
            Export
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {excel && (
            <DropdownMenuItem onSelect={excel}>
              Export to Excel
            </DropdownMenuItem>
          )}
          {pdf && (
            <DropdownMenuItem onSelect={pdf}>Export to PDF</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
