"use client";

import {
  ArrowSquareInIcon,
  ClockCountdownIcon,
  InfoIcon,
  RowsIcon,
  ShapesIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ColumnDef } from "@tanstack/react-table";
import { TableRowTitle } from "@/components/custom/tableRowTitle";
import { Task } from "@/lib/api/types";
import { StatusIndicator } from "@/components/custom/statusIndicator";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";

export const taskColumns: ColumnDef<Task>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex items-center gap-1 text-gray-400">
          <ArrowSquareInIcon weight="bold" />
          view
        </div>
      );
    },
  },

  {
    accessorKey: "title",
    header: () => <TableRowTitle icon={ShapesIcon} title="Task Name" />,
  },
  {
    accessorKey: "description",
    header: () => <TableRowTitle icon={RowsIcon} title="Description" />,
  },
  {
    accessorKey: "due_date",
    header: () => <TableRowTitle icon={ClockCountdownIcon} title="Deadline" />,
    cell: ({ row }) => {
      const dueDateValue = row.getValue("due_date") as string;
      if (!dueDateValue) {
        return <span className="text-gray-400">No set deadline</span>;
      }

      const today = new Date();
      const deadline = new Date(dueDateValue);

      // difference in milliseconds
      const diffInMs = deadline.getTime() - today.getTime();

      // convert calculated difference to days
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

      // deadline passed
      if (diffInDays < 0) {
        return (
          <span className="text-red-600">
            Overdue by {Math.abs(diffInDays)}d
          </span>
        );
      }

      // deadline date
      if (diffInDays === 0) {
        return <span className="text-red-600">Due Today</span>;
      }

      return <span className="text-green-600">{diffInDays} days left</span>;
    },
  },
  {
    accessorKey: "is_completed",
    header: () => (
      <div className="flex justify-center items-center">
        <TableRowTitle icon={InfoIcon} title="Status" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <StatusIndicator isCompleted={row.getValue("is_completed")} />
        </div>
      );
    },
  },
];
