import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { encryptRoute, decryptRoute } from "./../components/routeEncryptor";

import {
    FaPlus,
    FaSearch,
    FaPhoneAlt,
    FaCalendarAlt,FaUserInjured
} from "react-icons/fa";
import userImg from "../assets/img/user.jpg"; // update path
import ApiServices from "../utils/ApiServices";
import nodataImg from "../assets/img/no_data.png"; // update path

export default function PatientPage() {
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            let response;
            response = await ApiServices.getPatientList();
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
                console.warn("No appointments:", error.response.data?.message);
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
            {/* Topbar */}
            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-end">
                    {/* Search + Add */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                        <NavLink
                            to={`/${encryptRoute("patient-enroll")}`}
                        >
                            <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-green-600">
                                <FaPlus />
                            </button>

                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : cards.length === 0 ? (
                    <div className="bg-white rounded-md p-6 border border-gray-200 shadow-xs flex flex-col items-center justify-center text-center text-gray-500 col-span-full min-h-[50vh]">
                       <FaUserInjured  className="text-3xl"/>
                        <p className="text-lg font-medium">Patient not found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map((card) => (
                              <NavLink
                  to={`/${encryptRoute("patientProfile")}`}
                  state={{ card }}
                  className="block"
                >
                     <div
                                key={card._id}
                                className="max-w-md bg-white rounded-md p-4 border border-gray-200"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-2">
                                    <p className="text-sm font-medium text-gray-500 text-left">
                                        <span className="font-semibold">{card.code}</span> <br />
                                        {card.doctor_id && (
                                            <span className="text-xs text-gray-400">
                                                With Doctor {card.doctor_id?.name || "Unknown"}
                                            </span>
                                        )}

                                    </p>

                                </div>

                                {/* Patient Info */}
                                <div className="flex items-center justify-between pb-2 mb-2">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={userImg}
                                            alt="patient"
                                            loading="lazy"
                                            className="w-10 h-10 p-[2px] rounded-full ring-2 ring-gray-200 object-cover"
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500 text-left">
                                                Patient name
                                            </p>
                                            <p className="text-sm font-medium text-gray-600 text-left">
                                                {card.name || "Unknown"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                            <FaPhoneAlt className="text-gray-600 w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 text-left">
                                                Phone number
                                            </p>
                                            <p className="text-sm font-medium text-gray-600 text-left">
                                                {card.phone || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Date and Time */}
                                <div className="flex items-center gap-2  border-gray-300">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                        <FaCalendarAlt className="text-gray-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 text-left">
                                            Date and time
                                        </p>
                                        <p className="text-sm font-medium text-gray-600">
                                            {card.createdAt || "N/A"}
                                        </p>
                                    </div>

                                </div>


                            </div>
                </NavLink>
                           
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
