import { Outlet,useNavigate } from "react-router-dom"; 
import { LuCircleArrowLeft, LuCircleCheckBig } from "react-icons/lu";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApiService from "../utils/ApiServices.js";
import { encryptRoute, decryptRoute } from "./../components/routeEncryptor"; 



export default function qualificationadd() {

    
    const [loading, setLoading] = useState(false);
    const [qualificationName, setqualificationName] = useState("");
    const [description, setDescription] = useState("");
    const [abbreviation, setAbbreviation] = useState([]);  
    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        const payload = {
            name: qualificationName,
            abbreviation: abbreviation,
            description: description,
        };

        console.log("Submitting payload:", payload);

        try {
            const res = await ApiService.addQualification(payload);
            console.log("Qualification Added Successfully:", res.data);
            toast.success("Qualification added successfully!"); setTimeout(() => {
                navigate(`/${encryptRoute("master")}/${encryptRoute("qualification")}`);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                    Qualification Name <span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={qualificationName}
                                    onChange={(e) => setqualificationName(e.target.value)}
                                    placeholder="Enter Name"
                                    className="form-input"
                                    maxLength={30}
                                    required
                                />



                            </div>

                             <div>
                                <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                    Abbreviation <span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={abbreviation}
                                    onChange={(e) => setAbbreviation(e.target.value)}
                                    placeholder="Enter abbreviation"
                                    className="form-input"
                                    maxLength={10}
                                    required
                                />



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