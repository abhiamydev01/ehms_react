import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { encryptRoute, decryptRoute } from "../components/routeEncryptor";
import { FaStethoscope, FaMoneyBillWave, FaUserMd } from "react-icons/fa";
import Loader from "../components/loader";


import {
    FaPlus,
    FaSearch,
    FaPhoneAlt,
    FaCalendarAlt
} from "react-icons/fa";
import userImg from "../assets/img/user.jpg"; // update path
import ApiServices from "../utils/ApiServices";


export default function DoctorPatientPage() {
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
   

    const fetchTransactions = async () => {
        setLoading(true);

        try {


            let response;


            response = await ApiServices.getPatientDoctorAndHospitalDoctors();

            if (!response || !response.data) {
                console.warn("No response received");
                setCards([]);
                return;
            }

            const result = response.data?.data || [];

            if (Array.isArray(result) && result.length > 0) {
                setCards(result);
            } else {
                setCards([]);
            }
        } catch (error) {
            console.error("API Failed:", error);

            if (error.response?.status === 400) {
                console.warn("No Doctor:", error.response.data?.message);
                setCards([]);
            } else {
                setCards([]);
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="h-full min-h-0 flex flex-col bg-gray-50 overflow-hidden">

            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-end">

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                        {/* <NavLink    
                            to={`/${encryptRoute("patient-enroll")}`}
                        >
                            <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-green-600">
                                <FaPlus />
                            </button>

                        </NavLink> */}
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                {loading ? (
                    // ✅ Loader section
                    <div className="flex flex-col items-center justify-center pb-2 bg-white border border-gray-200 rounded-sm shadow-sm">
                        <Loader />
                        <p className="mt-1 text-sm font-medium text-gray-400">
                            Loading doctors...
                        </p>
                    </div>
                ) : cards.length === 0 ? (
                    // ✅ Empty state section
                    <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-md shadow-sm">
                        <FaUserMd className="text-gray-300 w-12 h-12 mb-3" />
                        <p className="text-sm font-medium text-gray-300">
                            No doctors available
                        </p>
                    </div>
                ) : (
                    // ✅ Cards grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map((card) => (
                            <div
                                key={card._id}
                                className="max-w-md bg-white rounded-md p-4 border border-gray-200"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-2">
                                    <div>
                                        <p className="text-xs text-gray-500 text-left">Department</p>
                                        <p className="text-sm font-medium text-gray-600 text-left">
                                            {card.department || "N/A"}
                                        </p>
                                    </div>

                                    <NavLink
                                        to={`/${encryptRoute("doctor")}/${encryptRoute("appointAdd")}`}
                                        state={{ card }} 
                                    >
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded-sm hover:border border-blue-500 hover:text-blue-500 hover:bg-transparent cursor-pointer flex items-center justify-center gap-1">
                                            <span className="text-sm font-medium">Book Appointment</span>
                                        </button>
                                    </NavLink>
                                </div>

                                {/* Doctor Info */}
                                <div className="flex items-center justify-between pb-2 mb-2">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={userImg}
                                            alt="doctor"
                                            loading="lazy"
                                            className="w-10 h-10 p-[2px] rounded-full ring-2 ring-gray-200 object-cover"
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500 text-left">Doctor name</p>
                                            <p className="text-sm font-medium text-gray-600 text-left">
                                                {card.name || "Unknown"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                            <FaMoneyBillWave className="text-gray-600 w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 text-left">
                                                Appointment Fee
                                            </p>
                                            <p className="text-sm font-medium text-gray-600 text-left">
                                                {card.appointmentPrice || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Specialization */}
                                <div className="flex items-center gap-2 border-gray-300">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                        <FaStethoscope className="text-gray-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 text-left">Specialization</p>
                                        <div className="text-sm text-left font-medium text-gray-600">
                                            {Array.isArray(card.specialization) &&
                                                card.specialization.length > 0 ? (
                                                card.specialization.map((spec, idx) => (
                                                    <div key={idx}>{spec}</div> // each specialization on new line
                                                ))
                                            ) : (
                                                <p>N/A</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}





            </div>
            {/* ✅ Pagination at bottom */}
            <div className="flex justify-center items-center gap-3 py-4 bg-white border-t border-gray-200">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-sm border border-gray-300 text-sm
                    bg-white text-gray-600 hover:bg-blue-500 hover:text-white
                    disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600"
                >
                    Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-sm border border-gray-300 text-sm
                    bg-white text-gray-600 hover:bg-blue-500 hover:text-white
                    disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
