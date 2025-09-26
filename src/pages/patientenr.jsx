import { Outlet } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from "../components/selectStyles.js";
import { LuCircleArrowLeft, LuCircleCheckBig, LuCloudUpload, LuCircleX } from "react-icons/lu";
import { FaAngleDoubleRight, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ApiServices from "../utils/ApiServices.js";
import { encryptRoute, decryptRoute } from "../components/routeEncryptor.js";
import { useNavigate } from "react-router-dom";
import { validateEmail, maxEmailLength } from "../components/validators.js";
import { Dialog } from "primereact/dialog";



const Gender = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];
const Bldgrp = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
];

const Relation = [
    { value: "Self", label: "Self" },
    { value: "Spouse", label: "Spouse" },
    { value: "Child", label: "Child" },
    { value: "Parent", label: "Parent" },
    { value: "Other", label: "Other" },
];








export default function patientadd() {
    const [patientname, setPatientname] = useState("");
    const [gender, setgender] = useState([]);
    const [selectedGender, setselectedGender] = useState([]);
    const [age, setAge] = useState("");
    const [dob, setDob] = useState([]);
    const [bldgrp, setBldgrp] = useState([]);
    const [selectedBldgrp, setselectedBldgrp] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const [selectedDoctor, setselectedDoctor] = useState(null);
    const [phone, setPhone] = useState("");

    const [email, setEmail] = useState("");
    const [relation, setRelation] = useState([]);
    const [selectedRelation, setselectedRelation] = useState([]);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingenr, setLoadingenr] = useState(false);
    const [error, setError] = useState("");

    const [showSmallModal, setShowSmallModal] = useState(false);
    const [showSmallModaltwo, setShowSmallModaltwo] = useState(false);
    const [dform, setDform] = useState({ disease: "", member: "" });
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [patientId, setPatientId] = useState(null);



    const [form, setForm] = useState({
        // Section One
        pregnant: "",
        oralContraceptives: "",
        medication: "",
        tobacco: "",
        controlledSubstances: "",
        allergies: "",
        illnessNotListed: "",

        // Family history entries
        familyHistory: [],

        // Hospitalization entries
        hospitalization: [],

        // Guardian info
        parentOrGuardianName: "",
        relationshipToPatient: ""
    });

    // temporary input states for small modals
    const [tempFamily, setTempFamily] = useState({ disease: "", familyMembers: "" });
    const [tempHospital, setTempHospital] = useState({ monthYear: "", reason: "", hospital: "" });


    const questions = [
        {
            key: "pregnant",
            label: "1. Are you pregnant or trying to get pregnant?",
            options: ["Yes", "No", "Not applicable"],
        },
        {
            key: "contraceptives",
            label: "2. Are you taking oral contraceptives?",
            options: ["Yes", "No", "Not applicable"],
        },
        {
            key: "medication",
            label: "3. Are you taking any medication?",
            options: ["Yes", "No"],
        },
        {
            key: "tobacco",
            label: "4. Do you use any tobacco?",
            options: ["Yes", "No"],
        },
        {
            key: "substances",
            label: "5. Do you use any controlled substances?",
            options: ["Yes", "No"],
        },
        {
            key: "allergies",
            label: "6. Do you have any allergies?",
            options: ["Yes", "No"],
        },
        {
            key: "illness",
            label: "7. Have you had any illness not listed above?",
            options: ["Yes", "No"],
        },
    ];


    useEffect(() => {
        const fetchDoctor = async () => {
            setLoading(true);
            try {
                const res = await ApiServices.getAllDoctorList();

                // ✅ Correct mapping
                const doctorOptions = res.data.data.map((doc) => ({
                    value: doc._id,
                    label: doc.name, // react-select ke liye label chahiye
                }));

                setDoctor(doctorOptions);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingenr(true);

        const payload = {
            name: patientname,
            gender: selectedGender?.value || null,
            age: age,
            dob: dob,
            bloodGroup: selectedBldgrp?.value || null,
            doctor_id: selectedDoctor?.value || null,
            phone: phone,
            email: email,
            relation: selectedRelation?.value || null,
            address: address,
            role: "patient"

        };

        console.log("Submitting payload:", payload);

        try {
            const res = await ApiServices.patientenroll(payload);
            console.log("Patient Added Successfully:", res.data);
            toast.success("Patient added successfully!");
            setPatientId(res.data.id);
            setTimeout(() => {
                setShowModal(true);



                //    navigate(`/${encryptRoute("patient")}`);
            }, 0);

        } catch (error) {
            console.error("Error patient enroll:", error);

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
            setLoadingenr(false);
        }
    };

    const handleAddFamilyHistory = () => {
        if (!tempFamily.disease || !tempFamily.familyMembers) return;

        setForm((prev) => ({
            ...prev,
            familyHistory: [...prev.familyHistory, tempFamily]
        }));

        setTempFamily({ disease: "", familyMembers: "" });
        setShowSmallModaltwo(false);
    };

    const handleAddHospitalization = () => {
        if (!tempHospital.monthYear || !tempHospital.reason || !tempHospital.hospital) return;

        setForm((prev) => ({
            ...prev,
            hospitalization: [...prev.hospitalization, tempHospital]
        }));

        setTempHospital({ monthYear: "", reason: "", hospital: "" });
        setShowSmallModal(false);
    };


    const handleSubmitMedicalHistory = async () => {
        const role = localStorage.getItem("role");
        //  const patient_id = role === "nurse" ? selectedPatients?.value : localStorage.getItem("id");

        const payload = {
            patient_id: patientId,
            sectionOne: {
                pregnant: form.pregnant || "Not applicable",
                oralContraceptives: form.oralContraceptives || "Not applicable",
                medication: form.medication || "No",
                tobacco: form.tobacco || "No",
                controlledSubstances: form.controlledSubstances || "No",
                allergies: form.allergies || "No",
                illnessNotListed: form.illnessNotListed || "No"
            },
            familyHistory: form.familyHistory.length ? form.familyHistory : [],
            hospitalization: form.hospitalization.length ? form.hospitalization : [],

            guardianInfo: {
                parentOrGuardianName: form.parentOrGuardianName || "",
                relationshipToPatient: form.relationshipToPatient || ""
            }

        };

        console.log("Submitting payload:", payload);


        try {
            const res = await ApiServices.addMedicalHistory(payload);
            toast.success("Medical history saved!");
            setShowModal(false);
             navigate(`/${encryptRoute("patient")}`); // redirect
            // Reset form
            setForm({
                pregnant: "",
                oralContraceptives: "",
                medication: "",
                tobacco: "",
                controlledSubstances: "",
                allergies: "",
                illnessNotListed: "",
                familyHistory: [],
                hospitalization: [],
                parentOrGuardianName: "",
                relationshipToPatient: ""
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Error saving history");
        }
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
                                Name <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={patientname}
                                onChange={(e) => setPatientname(e.target.value)}
                                placeholder="Enter name"
                                className="form-input"
                                maxLength="25"
                                required
                            />
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
                                Age <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Enter age"
                                className="form-input number-only"
                                maxLength="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Date Of Birth <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                placeholder="Enter dob"
                                className="form-input"

                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Blood Group
                            </label>
                            <div className="space-y-1">
                                <Select
                                    options={Bldgrp}
                                    value={selectedBldgrp}  // ✅ Set value from state
                                    onChange={(e) => setselectedBldgrp(e)} // ✅ Update state on change
                                    placeholder="Search & select group"
                                    styles={customSelectStyles}

                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Choose Doctor
                            </label>
                            <Select
                                options={doctor}
                                value={selectedDoctor}
                                onChange={setselectedDoctor}
                                placeholder={loading ? "Loading doctors..." : "Select Doctor"}
                                styles={customSelectStyles}
                                isDisabled={loading}
                            />



                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Mobile <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter number"
                                className="form-input number-only"
                                maxLength="10"
                                required
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Email
                            </label>
                            <div className="space-y-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    className={`form-input ${error ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {/* <small className="text-gray-500">{email.length}/{maxEmailLength}</small> */}
                                {error && <p className="text-red-500 text-xs text-left">{error}</p>}
                            </div>

                        </div>





                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Relation <span className="text-red-500 font-bold">*</span>
                            </label>
                            <Select
                                options={Relation}
                                value={selectedRelation}
                                onChange={setselectedRelation}
                                placeholder={loading ? "Loading relation..." : "Select Relation"}
                                styles={customSelectStyles}
                                isDisabled={loading}
                                required />


                        </div>


                        <div className="md:col-span-9">
                            <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter adress"
                                className="form-input"

                            />


                        </div>
                    </div>


                    <div className="flex justify-end mt-4">

                        <button
                            type="submit"
                            disabled={loadingenr}
                            className={`bg-blue-500 border text-white px-2 py-1 rounded-sm border-blue-500 flex items-center justify-center gap-1
    ${loadingenr ? "opacity-50 cursor-not-allowed" : "hover:text-blue-500 hover:bg-transparent cursor-pointer"}
  `}
                        >
                            <LuCircleCheckBig />
                            <span className="text-sm font-medium">
                                {loadingenr ? "Submitting..." : "Submit"}
                            </span>
                        </button>
                    </div>


                </form>

            </div>

            <Dialog

                visible={showModal}
                style={{ width: "40vw" }}
                modal
                header={
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-lg font-semibold">Add Medical History</h2>
                        <span
                            onClick={() => {
                                setShowModal(false);                
                                navigate(`/${encryptRoute("patient")}`);  
                            }}
                            className="flex items-center justify-bottom gap-2 px-3 py-1 text-sm text-blue-600 cursor-pointer"
                        >
                            Skip <FaAngleDoubleRight />
                        </span>

                    </div>
                }
                closable={false} // hide default close icon
                onHide={() => setShowModal(false)}
            >
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold">Section One</h2>

                    {questions.map((q) => (
                        <div key={q.key}>
                            <h3 className="font-semibold text-sm mb-1">{q.label}</h3>
                            <div className="flex flex-col gap-2">
                                {q.options.map((option) => (
                                    <label
                                        key={option}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name={q.key}
                                            value={option}
                                            checked={form[q.key] === option}
                                            onChange={(e) =>
                                                setForm({ ...form, [q.key]: e.target.value })
                                            }
                                            className="hidden peer"
                                        />
                                        <span className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center bg-blue-600:border-blue-600 peer-checked:bg-blue-600">
                                            <span className="w-2 h-2rounded-full"></span>
                                        </span>
                                        <span className="text-sm font-semibold">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Family History */}
                    <div>
                        {/* Question Row */}
                        <div className="grid grid-cols-12 items-center gap-3">
                            <h3 className="col-span-11 font-semibold text-sm">
                                Please write in any medical condition and disease that has been in your family?
                            </h3>
                            <button
                                onClick={() => setShowSmallModaltwo(true)}
                                className="col-span-1 bg-blue-500 text-white p-2 border-0 rounded-full flex items-center justify-center hover:bg-blue-600"
                            >
                                <FaPlus className="text-xs rounded-full" />
                            </button>
                        </div>


                        {/* Small Modal */}
                        <Dialog
                            header="Add Family Medical History"
                            visible={showSmallModaltwo}
                            style={{ width: "30vw" }}
                            modal
                            onHide={() => setShowSmallModaltwo(false)}
                        >
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Disease"
                                    className="form-input"
                                    value={tempFamily.disease}
                                    onChange={(e) => setTempFamily({ ...tempFamily, disease: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Family Member"
                                    className="form-input"
                                    value={tempFamily.familyMembers}
                                    onChange={(e) => setTempFamily({ ...tempFamily, familyMembers: e.target.value })}
                                />



                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        onClick={handleAddFamilyHistory}

                                        className={`bg-blue-500 border text-white px-2 py-1 rounded-sm border-blue-500 flex items-center justify-center gap-1
      ${loading ? "opacity-50 cursor-not-allowed" : "hover:text-blue-500 hover:bg-transparent cursor-pointer"}`}
                                    >
                                        <LuCircleCheckBig />
                                        <span className="text-sm font-medium">
                                            Submit
                                        </span>
                                    </button>
                                </div>

                            </div>
                        </Dialog>
                    </div>


                    <div>
                        {/* Question Row */}
                        <div className="grid grid-cols-12 items-center gap-3">
                            <h3 className="col-span-11 font-semibold text-sm">
                                Please write in any medical condition and disease that has been in your family?
                            </h3>
                            <button
                                onClick={() => setShowSmallModal(true)}
                                className="col-span-1 bg-blue-500 text-white p-2 border-0 rounded-full flex items-center justify-center hover:bg-blue-600"
                            >
                                <FaPlus className="text-xs rounded-full" />
                            </button>
                        </div>


                        {/* Small Modal */}
                        <Dialog
                            header="Add Medical History"
                            visible={showSmallModal}
                            style={{ width: "30vw" }}
                            modal
                            onHide={() => setShowSmallModal(false)}
                        >
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Date"
                                    className="form-input"
                                    value={tempHospital.monthYear}
                                    onChange={(e) => setTempHospital({ ...tempHospital, monthYear: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Reason"
                                    className="form-input"
                                    value={tempHospital.reason}
                                    onChange={(e) => setTempHospital({ ...tempHospital, reason: e.target.value })}
                                />

                                <input
                                    type="text"
                                    placeholder="Hospital"
                                    className="form-input"
                                    value={tempHospital.hospital}
                                    onChange={(e) => setTempHospital({ ...tempHospital, hospital: e.target.value })}
                                />



                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        onClick={handleAddHospitalization}
                                        className={`bg-blue-500 border text-white px-2 py-1 rounded-sm border-blue-500 flex items-center justify-center gap-1
      ${loading ? "opacity-50 cursor-not-allowed" : "hover:text-blue-500 hover:bg-transparent cursor-pointer"}`}
                                    >
                                        <LuCircleCheckBig />
                                        <span className="text-sm font-medium">
                                            Submit
                                        </span>
                                    </button>
                                </div>

                            </div>
                        </Dialog>
                    </div>


                    <div className="">
                        <h3 className="font-semibold text-sm mb-3">
                            All the answer given to the above questions are answered accurately to the best of my knowledge. I understand that any inaccurate information can be dangerous to my (or my patient's health). It is my responsibility to inform the healthcare providers of any changes in the medical status.
                        </h3>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Parent or Guardian Name (if applicable)"
                                className="form-input"
                                value={form.disease}
                                onChange={(e) => setForm({ ...form, disease: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Relationship to Patient (if applicable)"
                                className="form-input"
                                value={form.member}
                                onChange={(e) => setForm({ ...form, member: e.target.value })}
                            />

                        </div>

                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            type="submit"
                            disabled={loading}
                            onClick={handleSubmitMedicalHistory}
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
                </div>
            </Dialog>


            <Outlet />
        </>
    );
}