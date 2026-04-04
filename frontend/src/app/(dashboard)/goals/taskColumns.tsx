"use client";

import {
  ClockCountdownIcon,
  InfoIcon,
  PenNibIcon,
  RowsIcon,
  ShapesIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ColumnDef } from "@tanstack/react-table";
import { TableRowTitle } from "@/components/custom/tableRowTitle";
import { Task } from "@/lib/api/types";
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <PenNibIcon />
          Edit
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
    accessorKey: "estimation",
    header: () => (
      <TableRowTitle icon={ClockCountdownIcon} title="Estimation" />
    ),
  },
  {
    accessorKey: "staus",
    header: () => <TableRowTitle icon={InfoIcon} title="Status" />,
  },
];
