"use client";

import cn from "@/utils/cn";
import ReactDataTable, { TableColumn } from "react-data-table-component";

interface Props<Row>
  extends Omit<React.ComponentProps<typeof ReactDataTable>, "columns"> {
  columns: TableColumn<Row>[];
}

const DataTable = (props: Props<any>) => {
  // Return JSX
  return (
    <div
      className={cn(
        "sa-data-table rounded-[1rem] !text-para flex flex-col min-h-fit[--scrollbarTrackColor:transparent]",
        props.className
      )}
    >
      <ReactDataTable
        {...props}
        className="!min-h-fit text-[1rem]"
        pagination
        sortIcon={<></>}
        paginationPerPage={25}
        paginationRowsPerPageOptions={[25, 50, 100]}
        fixedHeader
        highlightOnHover={props.highlightOnHover ?? true}
        customStyles={{
          head: {
            style: {
              fontSize: "1.1rem",
            },
          },
          headCells: {
            style: {
              borderBottom: 0,
              fontSize: "1rem",
            },
          },
          rows: {
            style: {
              padding: 0,
              fontSize: "1rem",
              color: "var(--color-para)",
            },
          },
          cells: {
            style: {
              padding: "0.5rem",
              borderBottom: 0,
              fontSize: "1rem",
            },
          },
        }}
      />
    </div>
  );
};

export default DataTable;
