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
            
            const response = await ApiService.getAllHospitals();
            const result = response.data?.data || [];;

            if (Array.isArray(result)) {
                setData(result);
                setFilteredData(result);
                setTotalRows(result.length);
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
                item.hospital_name?.toLowerCase().includes(value.toLowerCase()) ||
                item.hospital_code?.toLowerCase().includes(value.toLowerCase()) ||
                item.contact_number?.toLowerCase().includes(value.toLowerCase()) 
        );
        setFilteredData(filtered);
        setTotalRows(filtered.length);
        setPage(1);
    };

    const columns = [
        { name: "Code", selector: (row) => row.hospital_code, sortable: true },
        { name: "Name", selector: (row) => row.hospital_name, sortable: true },
         { name: "Contact", selector: (row) => row.contact_number, sortable: true },
        { name: "Email", selector: (row) => row.email },
        { name: "Timezone", selector: (row) => row.timezone },
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
            {/* Search & Create Button */}
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
                    to={`/${encryptRoute("master")}/${encryptRoute("create-hospital")}`}
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
