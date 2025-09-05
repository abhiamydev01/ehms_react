import { Outlet,useNavigate } from "react-router-dom"; 
import { LuCircleArrowLeft, LuCircleCheckBig } from "react-icons/lu";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { encryptRoute, decryptRoute } from "../components/routeEncryptor.js"; 
import { customSelectStyles } from "../components/selectStyles.js";
import Select from "react-select";
import ApiServices from "../utils/ApiServices.js";


export default function specializationadd() {

    
    const [department, setDepartment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [specializationName, setspecializationName] = useState("");
    const [description, setDescription] = useState(""); 
    const navigate = useNavigate();

      useEffect(() => {
            const fetchDepartment = async () => {
                setLoading(true);
                try {
                    const res = await ApiServices.getAllDepartments();
                    const departmentOptions = res.data.data.map((dept) => ({
                        value: dept._id,
                        label: dept.department_name,
                    }));
                    setDepartment(departmentOptions);
                } catch (error) {
                    console.log("Error fetching departnment:", error);
                    if (error.response) {
                        console.log("Error response:", error.response);
                    }
                } finally {
                    setLoading(false);
                }
            };
    
            fetchDepartment();
        }, []);
        

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

         

        const payload = {
            name: specializationName,
            department: selectedDepartment?.value,
            description: description,
        };

        console.log("Submitting payload:", payload);

        try {
            const res = await ApiServices.addSpecialization(payload);
            console.log("Specialization Added Successfully:", res.data);
            toast.success("Specialization added successfully!"); setTimeout(() => {
                navigate(`/${encryptRoute("master")}/${encryptRoute("specialization")}`);
            }, 0);
        } catch (error) {
            console.error("Error adding specialization:", error);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                    Specialization Name <span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={specializationName}
                                    onChange={(e) => setspecializationName(e.target.value)}
                                    placeholder="Enter Name"
                                    className="form-input"
                                    maxLength={30}
                                    required
                                />



                            </div>

                             <div>
                                <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                    Department <span className="text-red-500 font-bold">*</span>
                                </label>
                                 <Select
                                options={department}
                                value={selectedDepartment}
                                onChange={setSelectedDepartment }
                                placeholder={loading ? "Loading department..." : "Select Department"}
                                styles={customSelectStyles}
                                isDisabled={loading}
                                required />



                            </div>

    

                        </div>


                        <div className="grid grid-cols-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description"
                                    className="form-input"
                                    maxLength={60}
                                    
                                />



                            </div>

    

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