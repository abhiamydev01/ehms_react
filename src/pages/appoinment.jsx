import { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaPhoneAlt,
  FaCalendarAlt,
  FaRegCheckCircle,
  FaRegTimesCircle,
} from "react-icons/fa";
import userImg from "../assets/img/user.jpg"; // update path
import ApiServices from "../utils/ApiServices";
import { encryptRoute } from "./../components/routeEncryptor";
import Loader from "../components/loader";
import { NavLink } from "react-router-dom";
import nodataImg from "../assets/img/no_data.png"; // update path
import { confirmAction, showSuccess, showError } from "../utils/alerts";



export default function AppointmentPage() {
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentData, setPaymentData] = useState({ amount: "", mode: "", status: "Pending" });
const [selectedAppointment, setSelectedAppointment] = useState(null);
  const role = localStorage.getItem("role")?.toLowerCase() || "";

  // const navigate = useNavigate();

  const tabs = ["All", "Pending", "Confirmed", "Cancelled", "Completed"];

  const handleAcceptClick = (appointmentId) => {
  setSelectedAppointment(appointmentId);
  setShowPaymentModal(true);
};

  // ✅ Fetch appointments
  const fetchTransactions = async (date) => {
    setLoading(true);
    try {
      let response;
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("userId");

      if (role === "admin") {
        response = await ApiServices.getAllPatientAppointment({
          ...(isDateSelected && { appointmentDate: selectedDate }),
          limit,
          page,
        });

        console.log("Admin appointment response:", response);
      } else if (role === "nurse") {
        response = await ApiServices.getAllDoctorAppoinment({
          appointmentDate: date,
          limit,
          page,
        });
      } else if (role === "doctor") {
        response = await ApiServices.getAllDoctorAppoinment({
          appointmentDate: date,
          doctor_id: userId,
          limit,
          page,
        });
      } else if (role === "patient") {
        response = await ApiServices.getAllPatientAppointment({
          appointmentDate: date,
          limit,
          page,
        });
      }

      const result = response?.data?.data || [];
      setCards(Array.isArray(result) ? result : []);
      setTotalPages(response?.data?.totalPages || 1);
    } catch (error) {
      console.error("API Failed:", error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(selectedDate);
  }, [selectedDate, page]);

  // ✅ Accept / Decline handler
  const handleAction = async (appointmentId, action) => {
    try {
      setLoading(true);
      const response = await ApiServices.appointmentsAcceptCancelled({
        appointmentId,
        action,
      });

      if (response?.data) {
        setCards((prev) =>
          prev.map((card) =>
            card._id === appointmentId
              ? { ...card, status: action === "accept" ? "Confirmed" : "Cancelled" }
              : card
          )
        );

        // ✅ reusable success
        showSuccess(
          `Appointment has been ${action === "accept" ? "accepted" : "declined"}.`
        );
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      showError();
    } finally {
      setLoading(false);
    }
  };


  // Filter cards
  const filteredCards = cards.filter(
    (card) => activeTab === "All" || card.status === activeTab
  );

  return (
    <div className="h-full min-h-0 flex flex-col bg-gray-50 overflow-hidden">
      {/* Tabs + Date + Search */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${activeTab === tab
                  ? "bg-blue-400 text-white font-medium"
                  : "bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-300 hover:text-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Date input */}
          <div className="relative flex items-center gap-3">
            <FaCalendarAlt className="absolute right-5 top-2.5 text-gray-400 text-sm pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setIsDateSelected(true);
                setPage(1);
              }}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-full text-sm 
                focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-gray-400
                appearance-none
                focus:border-transparent 
                [&::-webkit-calendar-picker-indicator]:opacity-0 
                [&::-webkit-inner-spin-button]:appearance-none 
                [&::-webkit-clear-button]:appearance-none"
            />
          </div>

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
            {(role === "nurse")&&(
            <NavLink
              to={`/${encryptRoute("doctor")}/${encryptRoute("appointAdd")}`}
            >
              <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-green-600">
                <FaPlus />
              </button>
            </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center justify-center">
              <Loader />
              <p className="text-sm font-medium text-gray-500">
                Loading Appointments...
              </p>
            </div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <img src={nodataImg} alt="No data" className="w-40 h-40" />
            <p className="text-gray-500 mt-3">No appointments found</p>
          </div>
        ) : (



          // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          //   {filteredCards.map((card) => (
          //     <NavLink
          //       key={card._id}
          //       to={`/${encryptRoute("doctor")}/${encryptRoute("appointView")}`} // 👈 redirect target
          //       state={{ card }} 
          //       className="max-w-md bg-white rounded-md p-4 border border-gray-200 cursor-pointer hover:shadow-md transition block"
          //     >
          //       {/* Header */}
          //       <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-2">
          //         <p className="text-sm font-medium text-gray-500 text-left">
          //           <span className="font-semibold">{card.code}</span> <br />
          //           <span className="text-xs text-gray-400">
          //             With Doctor {card.doctor_id?.name || "Unknown"}
          //           </span>
          //         </p>
          //         <span
          //           className={`text-xs px-3 py-1 rounded-md ${card.status === "Pending"
          //               ? "bg-red-100 text-red-600"
          //               : card.status === "Confirmed"
          //                 ? "bg-green-100 text-green-600"
          //                 : card.status === "Cancelled"
          //                   ? "bg-yellow-100 text-yellow-600"
          //                   : card.status === "Completed"
          //                     ? "bg-blue-100 text-blue-600"
          //                     : "bg-gray-200 text-gray-600"
          //             }`}
          //         >
          //           {card.status}
          //         </span>
          //       </div>

          //       {/* Patient Info */}
          //       <div className="flex items-center justify-between pb-2 mb-2">
          //         <div className="flex items-center gap-3">
          //           <img
          //             src={userImg}
          //             alt="patient"
          //             loading="lazy"
          //             className="w-10 h-10 p-[2px] rounded-full ring-2 ring-gray-200 object-cover"
          //           />
          //           <div>
          //             <p className="text-xs text-gray-500 text-left">Patient name</p>
          //             <p className="text-sm font-medium text-gray-600 text-left">
          //               {card.patient_id?.name || "Unknown"}
          //             </p>
          //           </div>
          //         </div>
          //         <div className="flex items-center gap-2">
          //           <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
          //             <FaPhoneAlt className="text-gray-600 w-5 h-5" />
          //           </div>
          //           <div>
          //             <p className="text-xs text-gray-500 text-left">Phone number</p>
          //             <p className="text-sm font-medium text-gray-600 text-left">
          //               {card.patient_id?.phone || "N/A"}
          //             </p>
          //           </div>
          //         </div>
          //       </div>

          //       {/* Date and Time */}
          //       <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
          //         <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
          //           <FaCalendarAlt className="text-gray-600 w-5 h-5" />
          //         </div>
          //         <div>
          //           <p className="text-xs text-gray-500 text-left">Date and time</p>
          //           <p className="text-sm font-medium text-gray-600">
          //             {card.appointmentDate || "N/A"}
          //           </p>
          //         </div>
          //         <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-md">
          //           {card.timeSlot || "N/A"}
          //         </span>
          //       </div>
          //     </NavLink>
          //   ))}
          // </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <div
                key={card._id}
                className="max-w-md bg-white rounded-md p-4 border border-gray-200 cursor-pointer hover:shadow-md transition flex flex-col justify-between"
              >
                <NavLink
                  to={`/${encryptRoute("doctor")}/${encryptRoute("appointView")}`}
                  state={{ card }}
                  className="block"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-2">
                    <p className="text-sm font-medium text-gray-500 text-left">
                      <span className="font-semibold">{card.code}</span> <br />
                      <span className="text-xs text-gray-400">
                        With Doctor {card.doctor_id?.name || "Unknown"}
                      </span>
                    </p>
                    <span
                      className={`text-xs px-3 py-1 rounded-md ${card.status === "Pending"
                        ? "bg-red-100 text-red-600"
                        : card.status === "Confirmed"
                          ? "bg-green-100 text-green-600"
                          : card.status === "Cancelled"
                            ? "bg-yellow-100 text-yellow-600"
                            : card.status === "Completed"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {card.status}
                    </span>
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
                        <p className="text-xs text-gray-500 text-left">Patient name</p>
                        <p className="text-sm font-medium text-gray-600 text-left">
                          {card.patient_id?.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                        <FaPhoneAlt className="text-gray-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 text-left">Phone number</p>
                        <p className="text-sm font-medium text-gray-600 text-left">
                          {card.patient_id?.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                      <FaCalendarAlt className="text-gray-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 text-left">Date and time</p>
                      <p className="text-sm font-medium text-gray-600">
                        {card.appointmentDate || "N/A"}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-md">
                      {card.timeSlot || "N/A"}
                    </span>
                  </div>
                </NavLink>

                {/* Footer buttons for nurse */}
            {/* Footer */}
<div >
  {role === "nurse" && card.status === "Pending" ? (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction(card._id, "accept")}
        className="flex-1 bg-green-400 text-white px-1 py-1 rounded-md hover:bg-green-500"
        disabled={loading}
      >
        Accept
      </button>
      <button
        onClick={() => handleAction(card._id, "decline")}
        className="flex-1 bg-red-400 text-white px-1 py-1 rounded-md hover:bg-red-500"
        disabled={loading}
      >
        Reject
      </button>
    </div>
  ) : (
    // Full-width status button for non-Pending
    <div
      className={`w-full text- text-sm px-3 py-2 rounded-md ${
        card.status === "Confirmed"
          ? "bg-green-100 text-green-600"
          : card.status === "Cancelled"
          ? "bg-yellow-100 text-yellow-600"
          : card.status === "Completed"
          ? "bg-blue-100 text-blue-600"
          : "bg-red-100 text-red-600"
      }`}
    >
      {card.status === "Confirmed"
        ? "Appointment is confirmed"
        : card.status === "Cancelled"
        ? "Appointment is cancelled"
        : card.status === "Completed"
        ? "Appointment is completed"
        : card.status === "Pending"
        ? "Appointment is pending"
        : card.status}
    </div>
  )}

  
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

