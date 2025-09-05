import { Outlet } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from "../components/selectStyles.js";
import { LuCircleArrowLeft, LuCircleCheckBig } from "react-icons/lu";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApiService from "../utils/ApiServices.js";
import { encryptRoute, decryptRoute } from "../components/routeEncryptor.js";
import { useNavigate } from "react-router-dom";



export default function gvradd() {

    const [gvrcode, setGvrcode] = useState([]);
    const [loading, setLoading] = useState(false);
    const [parameter, setParameter] = useState(null);
    const [normalrange, setNormalrange] = useState("");
    const [globalrange, setGlobalrange] = useState("");
    const [unit, setUnit] = useState([]);
       const navigate = useNavigate();


   

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        

        const payload = {
            code: gvrcode,
            parameter_name: parameter,
            normal_range: normalrange,
            global_range: globalrange,
            unit: unit,
        };

        console.log("Submitting payload:", payload);

        try {
            const res = await ApiService.addGVRReports(payload);
            console.log("Gvr Added Successfully:", res.data);
            toast.success("Gvr added successfully!"); setTimeout(() => {
                navigate(`/${encryptRoute("master")}/${encryptRoute("gvr")}`);
            }, 0);
        } catch (error) {
            console.error("Error adding gvr:", error);

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
                                Gvr Code  <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={gvrcode}
                                onChange={(e) => setGvrcode(e.target.value)}
                                placeholder="Enter code"
                                className="form-input"
                                maxLength={10}
                                required
                                 
                            />



                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Parameter <span className="text-red-500 font-bold">*</span>
                            </label>
                             <input
                                type="text"
                                value={parameter}
                                onChange={(e) => setParameter(e.target.value)}
                                placeholder="Enter parameter"
                                className="form-input"
                                maxLength={50}
                                required
                              
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Normal Range <span className="text-red-500 font-bold">*</span>
                            </label>
                             <input
                                type="text"
                                value={normalrange}
                                onChange={(e) => setNormalrange(e.target.value)}
                                placeholder="Enter range"
                                className="form-input"
                                maxLength={20}
                                required
                              
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Globle Range   <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={globalrange}
                                onChange={(e) => setGlobalrange(e.target.value)}
                                placeholder="Enter range"
                                className="form-input"
                                maxLength={20}
                                required
                              
                            />



                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Unit  <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder="Enter unit"
                                className="form-input"
                                maxLength={20}
                                required
                                 
                            />



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