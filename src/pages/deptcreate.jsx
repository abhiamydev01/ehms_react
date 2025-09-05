import { Outlet } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from "../components/selectStyles.js";
import { LuCircleArrowLeft, LuCircleCheckBig } from "react-icons/lu";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApiService from "../utils/ApiServices.js";
import { encryptRoute, decryptRoute } from "./../components/routeEncryptor";
import { useNavigate } from "react-router-dom";



export default function departmentadd() {

    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [departmentName, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchHospitals = async () => {
            setLoading(true);
            try {
                const res = await ApiService.getAllHospitals();
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
                const res = await ApiService.getAllHospitalDoctors(selectedHospital.value);

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

        console.log(departmentName);

        const payload = {
            department_name: departmentName,
            hospital_id: selectedHospital?.value,
            head_of_department_doc_id: selectedDoctor?.value || null,
            department_description: description,
        };

        console.log("Submitting payload:", payload);

        try {
            const res = await ApiService.addDepartment(payload);
            console.log("Department Added Successfully:", res.data);
            toast.success("Department added successfully!"); setTimeout(() => {
                navigate(`/${encryptRoute("master")}/${encryptRoute("department")}`);
            }, 0);
        } catch (error) {
            console.error("Error adding department:", error);

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Department Name <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={departmentName}
                                onChange={(e) => setDepartmentName(e.target.value)}
                                placeholder="Enter Name"
                                className="form-input"
                                maxLength={50}
                                required
                            />



                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Hospital <span className="text-red-500 font-bold">*</span>
                            </label>
                            <Select
                                options={hospitals}
                                value={selectedHospital}
                                onChange={setSelectedHospital}
                                placeholder={loading ? "Loading hospitals..." : "Select Hospital"}
                                styles={customSelectStyles}
                                isDisabled={loading}
                                required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Head Of Department
                            </label>
                            <Select
                                options={doctors}
                                value={selectedDoctor}
                                onChange={setSelectedDoctor}
                                placeholder={
                                    loadingDoctors ? "Loading doctors..." : "Select Head of Department"
                                }
                                styles={customSelectStyles}
                                isDisabled={!selectedHospital || loadingDoctors}
                            />
                        </div>


                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-input description-validation" rows=""
                                placeholder="Description" data-maxlength="200"
                            />
                            <div className="char-count text-xs text-gray-500 text-right mt-1"> {description.length}/200 </div>

                        </div>

                    </div>
                    {/* Submit Button */}
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

                    <Outlet />
                </form>

            </div>

        </>

    );
}