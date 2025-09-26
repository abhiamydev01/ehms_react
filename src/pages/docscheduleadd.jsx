import { Outlet } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from "../components/selectStyles.js";
import { LuCircleArrowLeft, LuCircleCheckBig, LuCloudUpload, LuCircleX } from "react-icons/lu";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ApiServices from "../utils/ApiServices.js";
import { encryptRoute, decryptRoute } from "../components/routeEncryptor.js";
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "primereact/multiselect";





const DaysWeeks = [
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
];
const Appointment = [
    { value: "virtual", label: "Virtual" },
    { value: "in-person", label: "In-Person" },
    { value: "both", label: "Both" },

];




export default function scheduleadd() {

    const [hospital, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [daysWeeks, setdaysWeeks] = useState([]);
    const [selecteddaysWeeks, setselecteddaysWeeks] = useState([]);
    // JSON.stringify(selecteddaysWeeks)

    const [avilfrom, setAvilfrom] = useState([]);
    const [avilto, setAvilto] = useState("");
    const [slot, setSlot] = useState("");
    const [appointment, setAppointment] = useState([]);
    const [selectedAppointment, setselectedAppointment] = useState([]);
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchHospitals = async () => {
            setLoading(true);
            try {
                const res = await ApiServices.getAllHospitals();
                const hospitalOptions = res.data.data.map((hosp) => ({
                    value: hosp._id,
                    label: hosp.hospital_name,
                }));
                setHospitals(hospitalOptions);
            } catch (error) {
                console.log("Error fetching hospitals:", error);
                if (error.response) {
                    console.log("Error response:", error.response);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHospitals();
    }, []);

    useEffect(() => {
        if (!selectedHospital) return;
        setSelectedDoctor(null);
        setDoctors([]);
        setLoadingDoctors(true);

        const fetchDoctors = async () => {
            setLoadingDoctors(true);
            try {
                const res = await ApiServices.getAllHospitalDoctors(selectedHospital.value);

                console.log("Doctors API Response:", res.data);

                const doctorOptions = res.data.data.map((doc) => ({
                    value: doc._id,
                    label: doc.name,  // use correct key from API response
                }));
                setDoctors(doctorOptions);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchDoctors();
    }, [selectedHospital]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!selecteddaysWeeks || selecteddaysWeeks.length === 0) {
            toast.error("Please select at least one day.");
            setLoading(false);
            return;
        }

        const payload = {
            hospital_id: selectedHospital?.value,
            doctor_id: selectedDoctor?.value || null,
            day_of_week: selecteddaysWeeks,
            available_from: avilfrom,
            available_to: avilto,
            slot_duration: slot,
            appointment_type: selectedAppointment?.value,
            location: location
        };



        console.log("Submitting payload:", payload);

        try {
            const res = await ApiServices.addDoctorSlot(payload);
            console.log("Slot Added Successfully:", res.data);
            toast.success("Slot added successfully!"); setTimeout(() => {
                navigate(`/${encryptRoute("doctor")}/${encryptRoute("doc-schedule")}`);
            }, 0);
        } catch (error) {
            console.error("Error adding slot:", error);

            if (error.response) {
                console.log("Error status:", error.response.status);
                console.log("Error data:", error.response.data);
                toast.error(error.response.data?.message || "Server Error");
            } else if (error.request) {
                console.log("No response received:", error.request);
                toast.error("Network Error: No response from server");
            } else {
                console.log("Error message:", error.message);
                toast.error(error.message || "Unknown Error");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="bg-white rounded-sm border border-gray-200 shadow-xs p-4">
                <div className="flex justify-end items-end mb-4">
                    <button className="bg-blue-500 border text-white px-2 py-1 rounded-sm  border-blue-500 hover:text-blue-500 hover:bg-transparent cursor-pointer flex items-center justify-center gap-1">
                        <LuCircleArrowLeft />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Hospital <span className="text-red-500 font-bold">*</span>
                            </label>
                            <Select
                                options={hospital}
                                value={selectedHospital}
                                onChange={setSelectedHospital}
                                placeholder={loading ? "Loading hospital..." : "Select Hospital"}
                                styles={customSelectStyles}
                                isDisabled={loading}
                                required />


                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Doctor Name <span className="text-red-500 font-bold">*</span>
                            </label>
                            <Select
                                options={doctors}
                                value={selectedDoctor}
                                onChange={setSelectedDoctor}
                                placeholder={
                                    loadingDoctors ? "Loading doctors..." : "Select Doctors"
                                }
                                styles={customSelectStyles}
                                isDisabled={!selectedHospital || loadingDoctors}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Day of Weeks <span className="text-red-500 font-bold">*</span>
                            </label>
                            <div className="space-y-1">

                                <MultiSelect
                                    value={selecteddaysWeeks}
                                    onChange={(e) => setselecteddaysWeeks(e.value)}
                                    options={DaysWeeks}
                                    optionLabel="label"
                                    placeholder={loading ? "Loading days..." : "Select Days"}
                                    maxSelectedLabels={3}
                                    disabled={loading}
                                    //  display="chip" 
                                    className="w-full"
                                    panelClassName=""
                                    style={{ borderRadius: "2px" }}
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Appointment Type <span className="text-red-500 font-bold">*</span>
                            </label>
                            <Select
                                options={Appointment}
                                value={selectedAppointment}
                                onChange={(e) => setselectedAppointment(e)}
                                placeholder="Search & select appointment"
                                styles={customSelectStyles}
                                required
                            />


                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Available From <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="time"
                                value={avilfrom}
                                onChange={(e) => setAvilfrom(e.target.value)}
                                placeholder="Enter phone"
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Available To <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="time"
                                value={avilto}
                                onChange={(e) => setAvilto(e.target.value)}
                                placeholder="Enter phone"
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Slot Duration <span className="text-red-500 font-bold">*</span>
                            </label>

                            <input
                                type="text"
                                value={slot}
                                onChange={(e) => setSlot(e.target.value)}
                                placeholder="Enter slot"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1">
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Location <span className="text-red-500 font-bold">*</span>
                            </label>


                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter location"
                                className="form-input"
                                required
                            />



                        </div>




                    </div>





                    <div className="flex justify-end mt-4">

                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-blue-500 border text-white px-2 py-1 rounded-sm border-blue-500 flex items-center justify-center gap-1
    ${loading ? "opacity-50 cursor-not-allowed" : "hover:text-blue-500 hover:bg-transparent cursor-pointer"}
  `}
                        >
                            <LuCircleCheckBig />
                            <span className="text-sm font-medium">
                                {loading ? "Submitting..." : "Submit"}
                            </span>
                        </button>
                    </div>


                </form>

            </div>
            <Outlet />
        </>
    );
}