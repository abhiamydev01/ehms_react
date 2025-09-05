import { useState, useEffect } from "react";
import { FiTrash2, FiSearch } from "react-icons/fi";
import { LuCirclePlus } from "react-icons/lu";
import StatusBadge from "./badge/status";
import CustomDataTable from "../components/CustomDataTable";
import Loader from "../components/loader";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { encryptRoute, decryptRoute } from "./../components/routeEncryptor";
import ApiService from "../utils/ApiServices.js";

const TransactionsTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");

const fetchTransactions = async () => {
  setLoading(true);
  try {
    const res = await ApiService.getAllNures();

    const nuress = res.data?.data || [];
    console.log("Nures API Response:", nuress);

    if (Array.isArray(nuress)) {
      setData(nuress);
      setFilteredData(nuress);
      setTotalRows(nuress.length);
    } else {
      setData([]);
      setFilteredData([]);
      setTotalRows(0);
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
  setLoading(false);
};


    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);

        const filtered = data.filter(
            (item) =>
                item.code?.toLowerCase().includes(value.toLowerCase()) ||
                item.name?.toLowerCase().includes(value.toLowerCase())||
                item.department?.department_name?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
        setTotalRows(filtered.length);
        setPage(1);
    };

    const columns = [
        { name: "Code", selector: (row) => row.code, sortable: true },
        { name: "Name", selector: (row) => row.name, sortable: true },
        { name: "Hospital", selector: (row) => row.hospital_id?.hospital_name, sortable: true },
        { name: "Phone", selector: (row) => row.phone, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { name: "Qualification", selector: (row) => row.qualification?.join(", "), sortable: true },
        { name: "Experience", selector: (row) => row.experience, sortable: true },
        { name: "Department", selector: (row) => row.department?.department_name, sortable: true },
       


        { name: "Status", cell: () => <StatusBadge status={"Active"} /> },
        {
            name: "Actions",
            cell: () => (
                <div className="flex gap-3">
                    <FiTrash2 className="cursor-pointer text-red-500" />
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-sm border border-gray-200 shadow-xs p-4 overflow-x-auto">
            
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchText}
                        onChange={handleSearch}
                        className="border border-gray-300 px-2 py-1 rounded-sm w-45 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <NavLink
                    to={`/${encryptRoute("create-nurse")}`}
                >
                    <button className="bg-blue-500 text-white px-2 py-1 rounded-sm hover:border border-blue-500 hover:text-blue-500 hover:bg-transparent cursor-pointer flex items-center justify-center gap-1">
                        <LuCirclePlus />
                        <span className="text-sm font-medium">Add</span>
                    </button>
                </NavLink>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <CustomDataTable
                    columns={columns}
                    data={filteredData.slice((page - 1) * perPage, page * perPage)}
                    pagination
                    paginationServer={false}
                    paginationTotalRows={totalRows}
                    progressPending={loading}
                    onPageChange={(p) => setPage(p)}
                    onPerRowsChange={(newPerPage) => {
                        setPerPage(newPerPage);
                        setPage(1);
                    }}
                />
            )}
        </div>

    );
};

export default TransactionsTable;
