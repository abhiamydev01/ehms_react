import { Outlet } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from "../components/selectStyles.js";
import { LuCircleArrowLeft, LuCircleCheckBig, LuCloudUpload, LuCircleX } from "react-icons/lu";
import { useState } from "react";
import toast from "react-hot-toast";
import ApiServices from "../utils/ApiServices.js";
import { encryptRoute, decryptRoute } from "./../components/routeEncryptor";
import { useNavigate } from "react-router-dom";

import { validateEmail, maxEmailLength } from "../components/validators";




const options = [
    { value: "all", label: "All" },
    { value: "alternate", label: "Alternate" },
    { value: "1st_3rd", label: "1st 3rd" },
    { value: "none", label: "none" },
];




export default function hospitaladd() {
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState("");
    const [hospitalcode, setHospitalcode] = useState("");
    const [hospitalname, setHospitalname] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [startworktime, setStartworktime] = useState("");
    const [endworktime, setEndworktime] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile)); // for preview
            setFile(selectedFile);                          // store actual file
            setFileName(selectedFile.name);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("hospital_code", hospitalcode);
        formData.append("hospital_name", hospitalname);
        formData.append("contact_number", contact);
        formData.append("email", email);
        formData.append("website", website);
        formData.append("working_hours_start", startworktime);
        formData.append("working_hours_end", endworktime);
        formData.append("address", address);
        formData.append("description", description);
        formData.append("saturday_policy", "alternate");
        if (file) formData.append("logo", file);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const res = await ApiServices.addHospital(formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Hospital added successfully!");
            setTimeout(() => {
                navigate(`/${encryptRoute("master")}/${encryptRoute("hospital")}`);
            }, 500);
        } catch (error) {
            console.error("Error adding Hospital:", error);
            toast.error(error.response?.data?.message || "Failed to add hospital");
        } finally {
            setLoading(false);
        }
    };


    const handleRemove = () => {
        setPreview(null);
        setFileName("");
        document.getElementById("logo-upload").value = ""; // Reset file input
    };

    const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const { isValid, message } = validateEmail(value);
    setError(message);
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
                                Hospital Code <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={hospitalcode}
                                onChange={(e) => setHospitalcode(e.target.value)}
                                placeholder="Enter Code"
                                className="form-input" maxLength={10}
                                required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Hospital Name <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={hospitalname}
                                onChange={(e) => setHospitalname(e.target.value)}
                                placeholder="Enter name"
                                className="form-input"
                                maxLength="25"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Contact Number <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Enter contact"
                                className="form-input number-only" maxLength="10"
                                required />

                            <div className="char-count text-xs text-gray-500 text-right mt-1 hidden"> {contact.length}/10 </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                E-mail <span className="text-red-500 font-bold">*</span>
                            </label>
                            <div className="space-y-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    className={`form-input ${error ? "border-red-500" : "border-gray-300"
                                        }`}
                               required />
                                {/* <small className="text-gray-500">{email.length}/{maxEmailLength}</small> */}
                                {error && <p className="text-red-500 text-xs text-left">{error}</p>}
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Website
                            </label>
                            <input
                                type="text"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="Enter website"
                                className="form-input"

                                 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Start Working Time <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="time"
                                value={startworktime}
                                onChange={(e) => setStartworktime(e.target.value)}
                                placeholder="Enter time"
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                End Working Time <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="time"
                                value={endworktime}
                                onChange={(e) => setEndworktime(e.target.value)}
                                placeholder="Enter time"
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Saturday Policy  
                            </label>
                            <Select
                                options={options}
                                placeholder="Search & select saturday policy"
                                styles={customSelectStyles}
                             />


                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Logo
                            </label>
                            <div className="w-full">
                                <input
                                    type="file"
                                    id="logo-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                  />

                                <label
                                    htmlFor="logo-upload"
                                    className="block w-full h-8 border border-gray-300 rounded-xs text-center py-1 text-gray-600 text-sm cursor-pointer 
                hover:ring-1 hover:ring-blue-200 hover:shadow-xs hover:text-blue-400 transition"
                                >
                                    <div className="flex justify-center items-center gap-1">
                                        <LuCloudUpload /> Upload File
                                    </div>
                                </label>
                            </div>


                        </div>
                        <div className="w-full">
                            {preview && (
                                <div className="relative mt-3 flex items-center gap-3">

                                    <div className="relative w-12 h-12">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-12 h-12 object-cover rounded-full border border-gray-300"
                                        />


                                        <button
                                            type="button"
                                            onClick={handleRemove}
                                            className="absolute -top-1 -right-1 text-red-500  rounded-full w-4 h-4 flex items-center justify-center text-xs hover: cursor-pointer hover:bg-red-100"
                                        >
                                            <LuCircleX />
                                        </button>
                                    </div>


                                    <span className="text-sm text-gray-600 truncate max-w-[150px]" title={fileName}>
                                        {fileName}
                                    </span>
                                </div>
                            )}

                        </div>



                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Address <span className="text-red-500 font-bold">*</span>
                            </label>


                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-input description-validation" rows=""
                                placeholder="Address" data-maxlength="200" required
                            />
                            <div className="char-count text-xs text-gray-500 text-right mt-1"> {description.length}/200 </div>
                        </div>
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