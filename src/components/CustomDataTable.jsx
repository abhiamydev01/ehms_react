import DataTable from "react-data-table-component";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CustomDataTable = ({
  columns,
  data,
  paginationTotalRows,
  onPageChange,
  onPerRowsChange,
  paginationServer = false,
  progressPending = false,
}) => {
  return (
    <DataTable
  columns={columns}
  data={data}
  highlightOnHover
 // pagination
  paginationServer={paginationServer}
  paginationTotalRows={paginationTotalRows}
  onChangePage={onPageChange}
  onChangeRowsPerPage={onPerRowsChange}
  progressPending={progressPending}
  paginationIconPrevious={<FiChevronLeft />}
  paginationIconNext={<FiChevronRight />}
  noDataComponent={
    <div className="py-3 text-center text-gray-500 text-sm">
      There are no records to display
    </div>
  }
  persistTableHead   // <-- ADD THIS LINE
  customStyles={{
    headRow: {
      style: {
        minHeight: "40px",
        fontSize: "14px",
        fontWeight: "500",
        backgroundColor: "#f2f5f8",
      },
    },
    rows: {
      style: {
        fontSize: "13px",
        minHeight: "36px",
      },
    },
    pagination: {
      style: {
        justifyContent: "flex-start",
      },
    },
  }}
/>

  );
};

export default CustomDataTable;
