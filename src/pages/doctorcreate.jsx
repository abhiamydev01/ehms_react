import { Outlet } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from "../components/selectStyles.js";
import { LuCircleArrowLeft, LuCircleCheckBig, LuCloudUpload, LuCircleX } from "react-icons/lu";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ApiServices from "../utils/ApiServices.js";
import { encryptRoute, decryptRoute } from "../components/routeEncryptor.js";
import { useNavigate } from "react-router-dom";
import { validateEmail, maxEmailLength } from "../components/validators.js";

import { MultiSelect } from 'primereact/multiselect';





const Gender = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];



export default function doctoradd() {
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState("");
    const [doctorcode, setDoctorcode] = useState("");
    const [doctorname, setDoctorname] = useState("");
    const [hospital, setHospital] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);

    const [qualification, setQualification] = useState([]);
    const [selectedQualification, setselectedQualification] = useState([]);

    const [speacialization, setSpeacialization] = useState([]);
    const [selectedSpeacialization, setselectedSpeacialization] = useState([]);

    const [gender, setgender] = useState([]);
    const [selectedGender, setselectedGender] = useState([]);

    const [department, setDepartment] = useState([]);
    const [selectedDepartment, setselectedDepartment] = useState(null);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [appointprice, setAppointprice] = useState("");
    const [consultprice, setConsultprice] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
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
                setHospital(hospitalOptions);
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
        const fetchQualification = async () => {
            setLoading(true);
            try {
                const res = await ApiServices.getAllQualification();
                const qualificationOptions = res.data.data.map((quali) => ({
                    value: quali._id,
                    name: quali.name, // key matches optionLabel="name"
                }));
                setQualification(qualificationOptions);
            } catch (error) {
                console.error("Error fetching qualifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQualification();
    }, []);

    useEffect(() => {
        const fetchSpeacialization = async () => {
            setLoading(true);
            try {
                const res = await ApiServices.getAllSpecializations();
                const speacializationOptions = res.data.data.map((speacial) => ({
                    value: speacial._id,
                    name: speacial.name,
                }));
                console.log("recived data ", speacializationOptions)
                setSpeacialization(speacializationOptions);
            } catch (error) {
                console.log("Error fetching speacialization:", error);
                if (error.response) {
                    console.log("Error response:", error.response);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSpeacialization();
    }, []);

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
        if (!selectedQualification || selectedQualification.length === 0) {
            toast.error("Please select at least one qualification.");
            setLoading(false);
            return;
        }
        if (!selectedSpeacialization || selectedSpeacialization.length === 0) {
            toast.error("Please select at least one speacialization.");
            setLoading(false);
            return;
        }

        if (!file) {
            toast.error("Please upload a certificate file.");
            setLoading(false);
            return;
        }



        const formData = new FormData();
        formData.append("code", doctorcode);
        formData.append("name", doctorname);
        formData.append("hospital_id", selectedHospital?.value);
        formData.append("gender", selectedGender?.value || "");
        formData.append("phone", phone);
        formData.append("email", email);
        // formData.append("qualification", selectedQualification);
        formData.append("qualification", JSON.stringify(selectedQualification));
        formData.append("appointmentPrice", appointprice);
        formData.append("consultationPrice", consultprice);
        // formData.append("specialist", selectedSpeacialization);
        formData.append("specialist", JSON.stringify(selectedSpeacialization));

        formData.append("department", selectedDepartment?.value);
        formData.append("location", location);
        formData.append("role", "doctor");
        formData.append("description", description);

        console.log("selectedQualification", selectedQualification)
        console.log("selectedSpeacialization", selectedSpeacialization)

        if (file) formData.append("certificate", file);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }


        console.log(formData);

        try {
            const res = await ApiServices.doctorReg(formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Doctor registered successfully!");
            setTimeout(() => {
                navigate(`/${encryptRoute("doctor")}`);
            }, 500);
        } catch (error) {
            console.error("Error adding Registration:", error);
            toast.error(error.response?.data?.message || "Failed to add registered");
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
                                Doctor Code <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={doctorcode}
                                onChange={(e) => setDoctorcode(e.target.value)}
                                placeholder="Enter Code"
                                className="form-input" maxLength={10}
                                required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Doctor Name <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={doctorname}
                                onChange={(e) => setDoctorname(e.target.value)}
                                placeholder="Enter name"
                                className="form-input"
                                maxLength="25"
                                required
                            />
                        </div>

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
                                Gender <span className="text-red-500 font-bold">*</span>
                            </label>
                            <div className="space-y-1">
                                <Select
                                    options={Gender}
                                    value={selectedGender}  // ✅ Set value from state
                                    onChange={(e) => setselectedGender(e)} // ✅ Update state on change
                                    placeholder="Search & select gender"
                                    styles={customSelectStyles}
                                    required
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Phone <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter phone"
                                className="form-input number-only"
                                maxLength="10"
                                minLength="10"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Email <span className="text-red-500 font-bold">*</span>
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
                                Qualification <span className="text-red-500 font-bold">*</span>

                            </label>




                            <MultiSelect
                                value={selectedQualification}
                                onChange={(e) => setselectedQualification(e.value)}
                                options={qualification}
                                optionLabel="name"
                                placeholder={loading ? "Loading qualification..." : "Select Qualification"}
                                maxSelectedLabels={3}
                                disabled={loading}
                                //  display="chip" 
                                className="w-full"
                                panelClassName=""
                                style={{ borderRadius: "2px" }}
                                required
                            />

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Appointment Price <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={appointprice}
                                onChange={(e) => setAppointprice(e.target.value)}
                                placeholder="Enter price"
                                className="form-input number-only"
                                maxLength="4"
                                required
                            />
                            <div className="char-count text-xs text-gray-500 text-right mt-1 hidden"> {appointprice.length}/10 </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Consultation Price
                            </label>
                            <input
                                type="text"
                                value={consultprice}
                                onChange={(e) => setConsultprice(e.target.value)}
                                placeholder="Enter price"
                                className="form-input number-only"
                                maxLength="4" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Specialist 	<span className="text-red-500 font-bold">*</span>
                            </label>




                            <MultiSelect
                                value={selectedSpeacialization}
                                onChange={(e) => setselectedSpeacialization(e.value)}
                                options={speacialization}
                                optionLabel="name"
                                placeholder={loading ? "Loading speacialization..." : "Select Speacialization"}
                                maxSelectedLabels={3}
                                disabled={loading}
                                //  display="chip" 
                                className="w-full"
                                panelClassName=""
                                style={{ borderRadius: "2px" }}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Department 	<span className="text-red-500 font-bold">*</span>

                            </label>
                            <Select
                                options={department}
                                value={selectedDepartment}
                                onChange={setselectedDepartment}
                                placeholder={loading ? "Loading department..." : "Select Department"}
                                styles={customSelectStyles}
                                isDisabled={loading}
                                required />


                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter address"
                                className="form-input"
                            />
                        </div>





                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Certificate <span className="text-red-500 font-bold">*</span>

                            </label>


                            <div className="w-full">
                                <input
                                    type="file"
                                    id="logo-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                //  required
                                />

                                <label
                                    htmlFor="logo-upload"
                                    className="flex flex-col justify-center items-center w-full h-17 border-2 border-dashed border-gray-200 rounded-xs text-gray-600 text-sm cursor-pointer 
             hover:shadow-xs hover:text-blue-400 transition"
                                >
                                    <div className="flex flex-col items-center text-gray-300 hover:shadow-xs hover:text-blue-400 transition">
                                        <LuCloudUpload className="text-lg" />
                                        <span>Upload File</span>
                                    </div>
                                </label>
                            </div>

                            <div className="w-full text-center">
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

                        {/* Description - 8 columns */}
                        <div className="md:col-span-8">
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-input description-validation"
                                rows="3"
                                placeholder="Description"
                                data-maxlength="200"
                            />
                            <div className="char-count text-xs text-gray-500 text-right mt-1">
                                {description.length}/200
                            </div>
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