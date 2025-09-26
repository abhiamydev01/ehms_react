import { NavLink, useLocation } from "react-router-dom";
import { FaPhoneAlt, FaCommentDots, FaVideo, FaChevronDown, FaFilePdf, FaPlusCircle, FaCalendarAlt, FaUserMd, FaNotesMedical, FaInfoCircle, FaMedrt, FaUserEdit, FaClipboardList, FaCloudUploadAlt, FaTransgenderAlt, FaEnvelope, FaHeartbeat, FaTemperatureHigh } from "react-icons/fa";
import Img from "../assets/img/usericon.jpg";
import PatientBg from "../assets/img/patient.svg"; // 👈 your second image
import { TabView, TabPanel } from 'primereact/tabview';
import { encryptRoute, decryptRoute } from "./../components/routeEncryptor";
import userImg from "../assets/img/user.jpg"; // update path
import { useState, useEffect, useRef } from "react";
import { LuCloudUpload, LuCircleX, LuCircleCheckBig } from "react-icons/lu";
import { Dialog } from 'primereact/dialog';
import ApiServices from "../utils/ApiServices.js";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import Select from "react-select";
import { customSelectStyles } from "../components/selectStyles.js";


export default function AppointmentView() {

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [visible, setVisible] = useState(false);
  const [prescription, setPrescription] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [labreportselect, setLabreportselect] = useState({
    reportDate: "",
    reportType: "",
    labName: "",
    remarks: "",
  });
  const [labreport, setLabreport] = useState(false);
  const [vitals, setVitals] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const card = location.state?.card;
  const [currentCard, setCurrentCard] = useState(card);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [nextAppointmentDate, setNextAppointmentDate] = useState("");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [labFiles, setLabFiles] = useState([]); // multiple files
  const [labPreviews, setLabPreviews] = useState([]);
  const [previewModal, setPreviewModal] = useState({ open: false, type: "", url: "" });

  const [units, setUnit] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [range, setRange] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const role = localStorage.getItem("role")?.toLowerCase() || "";
 const [lastvitals, setLastVitals] = useState({});

  const getLastVitalsDetails = async () => {
        try {
            setLoading(true);
            const payload = { patient_id:card?.patient_id?._id };
            const res = await ApiServices.getLastVitalsDetails(payload);

            console.log("Vitals API Response:", res.data);
            setLastVitals(res.data || {});
        } catch (error) {
            console.error("Error fetching Vitals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (card?._id) {
            getLastVitalsDetails();
        }
    }, [card]);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile)); // for preview
      setFile(selectedFile);                          // store actual file
      setFileName(selectedFile.name);
    }
  };


  const handleRemove = () => {
    setPreview(null);
    setFileName("");
    document.getElementById("logo-upload").value = ""; // Reset file input
  };


  // Get button position for absolute dropdown
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // Recalculate position when open, scroll, or resize
  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
const fetchMedicalHistory = async () => {
  try {
    setLoading(true);
    const payload = { patientId: card?.patient_id?._id };
    const response = await ApiServices.getMedicalHistoryByPatient(payload);
    
    console.log("Full Axios response:", response); 
    console.log("API data:", response.data);

    if (response.data.success) {
      setMedicalHistory(response.data); // <- use response.data, not response
    }
  } catch (err) {
    console.error("Failed to fetch medical history", err);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  if (card?.patient_id?._id) fetchMedicalHistory();
}, [card?.patient_id?._id]);


  const handleStatusUpdate = async (status) => {
    try {
      const payload = {
        appointmentId: card?._id,
        status,
      };

      const res = await ApiServices.updateAppointmentStatus(payload);

      // Update only the current card status
      setCurrentCard((prev) => ({
        ...prev,
        status,
      }));

      // Show message from backend
      toast.success(res.data.message); // ✅ using backend message
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(error.response?.data?.message || "Failed to update appointment");
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchPreviousAppointments = async () => {
      try {
        setLoading(true);

        const payload = {
          patientId: card?.patient_id?._id,
          doctorId: card?.doctor_id?._id,
        };


        const res = await ApiServices.getAppoinmentBasedOnPatient(payload);
        console.log("Previous Appointments API Response:", res.data?.data || []);
        setPreviousAppointments(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (card?.patient_id?._id && card?.doctor_id?._id) {
      fetchPreviousAppointments();
    }
  }, [card]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);

      const payload = {
        patientId: card?.patient_id?._id,

      };


      const res = await ApiServices.getAllPrescriptionForPatient(payload);
      console.log("Previous Prescription API Response:", res.data?.data || []);
      setPrescription(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching prescription:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {


    if (card?.patient_id?._id) {
      fetchPrescriptions();
    }
  }, [card]);


  useEffect(() => {
    fetchLabreport();
  }, [card]);

  const fetchLabreport = async () => {
    try {
      setLoading(true);
      const payload = { patientId: card?.patient_id?._id };
      const res = await ApiServices.getLapReportsBasedOnPatient(payload);
      setLabreport(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching lab report:", error);
    } finally {
      setLoading(false);
    }
  };

 



  // --------- File handlers for Lab Report form ---------
  const handleLabFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Map each file to an object for easier preview handling
    const newFiles = selectedFiles.map(f => ({
      file: f,
      type: f.type.includes("image") ? "image" : "pdf",
      preview: f.type.includes("image") ? URL.createObjectURL(f) : null
    }));

    // Append to existing files
    setLabFiles(prev => [...prev, ...newFiles]);
  };


  const fetchvitals = async () => {
      try {
        setLoading(true);

        const payload = {
          patient_id: card?.patient_id?._id,

        };

        const res = await ApiServices.getHealthReports(payload);
        console.log("Vitals API Response:", res.data?.data || []);
        setVitals(res.data?.data || []);
        
      } catch (error) {
        console.error("Error fetching Vitals:", error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
  
    if (card?.patient_id?._id) {
      fetchvitals();
    }
  }, [card]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("patientId", card?.patient_id?._id || "");
      formData.append("appointmentId", card?._id || "");

      if (file) formData.append("prescriptionImage", file);
      if (nextAppointmentDate) formData.append("nextScheduleDate", nextAppointmentDate);

      const res = await ApiServices.uploadAppointmentPrescriptionForPatient(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Prescription Added successfully!");

      await fetchPrescriptions();

      setCurrentCard((prev) => ({
  ...prev,
  status: "Completed"
}));

      setVisible(false);
      setFile(null);
      setPreview(null);
      setNextAppointmentDate("");

    } catch (error) {
      console.error("Error adding Prescription:", error);
      toast.error(error.response?.data?.message || "Failed to add prescription");
    } finally {
      setLoading(false);
    }
  };


  const handleLabReportSubmit = async (e) => {
    e.preventDefault();
    if (!labFiles.length) { toast.error("Upload at least one file"); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("patientId", card?.patient_id?._id || "");
      formData.append("appointmentId", card?._id || "");
      formData.append("reportDate", labreportselect.reportDate || "");
      formData.append("reportType", labreportselect.reportType || "");
      formData.append("lab_name", labreportselect.labName || "");
      formData.append("remarks", labreportselect.remarks || "");

      labFiles.forEach(item => formData.append("reportFiles", item.file));



      await ApiServices.uploadLabReport(formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Lab Report added successfully!");
      await fetchLabreport();

      setVisible(false);
      setLabreportselect({ reportDate: "", reportType: "", labName: "", remarks: "" });
      setLabFiles([]); setLabPreviews([]);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add Lab Report");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const fetchUnit = async () => {
      setLoading(true);
      try {
        const res = await ApiServices.getGVRReports();
        // ✅ Store full objects, not just value/label
        const unitOptions = res.data.data.map((unit) => ({
          value: unit._id,
          label: `${unit.parameter_name}`,
          normal_range: unit.normal_range,
          global_range: unit.global_range,
          unit: unit.unit,
        }));
        setUnit(unitOptions);
      } catch (error) {
        console.log("Error fetching unit:", error);
        if (error.response) {
          console.log("Error response:", error.response);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, []);

  const handleUnitChange = (option) => {
    setSelectedUnit(option);
  };


const handleVitalsSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = {
      patient_id: card?.patient_id?._id || "",
      parameter_id: selectedUnit?.value || "",
      patient_range: range || "",
      doctor_id: card?.doctor_id?._id || ""
    };

    console.log("Submitting vitals payload:", payload);

    await ApiServices.addHealthReports(payload);

    toast.success("Vitals added successfully!");

    // ✅ Fetch latest vitals from backend immediately
    await fetchvitals();

    // Reset form
    setSelectedUnit(null);
    setRange("");
    setVisible(false);

  } catch (error) {
    console.error("Error adding vitals:", error);
    toast.error(error.response?.data?.message || "Failed to add vitals");
  } finally {
    setLoading(false);
  }
};









  return (
    <>
      <div className="bg-white border border-gray-200 rounded-sm shadow-xs flex flex-col md:flex-row justify-between items-center overflow-hidden mb-3">

        {/* Left: Profile & Info */}
        <div className="flex items-center px-4 py-4 space-x-6">
          <img
            src={Img}
            alt="Profile"
            className="w-22 h-26 rounded-sm object-cover"
          />
          <div className="text-left">
            <div className="text-sm font-medium text-indigo-500"> {card.patient_id?.code || "Unknown"}</div>
            <h2 className="text-md font-medium">{card.patient_id?.name || "Unknown"}</h2>
            <p className="text-xs text-gray-600">
              {card.patient_id?.email || "Unknown"}
            </p>
             
            <div className="text-sm text-gray-600 mt-3 flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <FaPhoneAlt className="text-gray-400" />
                <span className="font-medium">{card.patient_id?.phone || "Unknown"}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FaCalendarAlt className="text-gray-400" />
                <span>
                  Last Visited : <span className="font-medium"> {card?.lastVisitDate || "Unknown"}</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Background Design */}
        <div className="hidden md:block">
          <img src={PatientBg} alt="Decoration" className="h-34" />
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col items-center space-y-3 p-4">

          <div className="inline-block text-left">
             <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-700 mt-3">
        <p><span className="font-medium">Age:</span> {card.patient_id?.age || "N/A"}</p>
        <p><span className="font-medium">DOB:</span> {card.patient_id?.dob || "N/A"}</p>
        <p><span className="font-medium">Blood Group:</span> {card.patient_id?.bloodGroup || "N/A"}</p>
        <p><span className="font-medium">Gender:</span> {card.patient_id?.gender || "N/A"}</p>
        <p><span className="font-medium">Relation:</span> {card.patient_id?.relation || "N/A"}</p>
      </div>
{/* {(role === "nurse")&&(
            <button
              ref={buttonRef}
              onClick={() => setOpen(!open)}
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-1 text-sm rounded-md flex items-center space-x-2"
            >
              <FaCalendarAlt />
              <span>Update Appointment</span>
              <FaChevronDown className="ml-1 w-3 h-3" />
            </button>
)} */}

            {/* Dropdown Portal */}
            {open &&
              createPortal(
                <div
                  ref={dropdownRef}
                  className="fixed z-50 mt-1 rounded-md shadow-lg bg-white border border-gray-200"
                  style={{ top: coords.top, left: coords.left, width: coords.width }}
                >
                  <div className="py-1">
                    <button
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      onClick={() => handleStatusUpdate("Cancelled")}
                    >
                      Cancel
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      onClick={() => handleStatusUpdate("Completed")}
                    >
                      Completed
                    </button>
                  </div>
                </div>,
                document.body
              )}
          </div>

        </div>
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-3">
        <div className="xl:col-span-5 flex">
          <div className="bg-white shadow-xs rounded-sm border border-gray-200 w-full">
            <div className="border-b border-gray-200 px-4 py-3">
              <h5 className="font-semibold text-md text-gray-600 flex items-center gap-2">
                <FaClipboardList /> Appointment Details
              </h5>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center rounded-full bg-gray-100 text-gray-800 w-10 h-10">
                    <FaCalendarAlt className="text-blue-600" />
                  </span>
                  <div>
                    <h6 className="text-sm font-semibold text-gray-500 text-left">Appointment Date</h6>


                    <p className="text-xs font-semibold text-gray-400 text-left">
                      {card?.appointmentDate || ""}
                    </p>



                  </div>
                </div>

                {/* Blood Group */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center rounded-full bg-gray-100 text-gray-800 w-10 h-10">
                    <FaMedrt className="text-blue-500" />
                  </span>
                  <div>
                    <h6 className="text-sm font-semibold text-gray-500 text-left">Appointment Type</h6>
                    <p className="text-xs font-semibold text-gray-400 text-left">
                      {card?.appointment_type || ""}
                    </p>


                  </div>
                </div>


                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center rounded-full bg-gray-100 text-gray-800 w-10 h-10">
                    <FaUserMd className="text-blue-600" />
                  </span>
                  <div>
                    <h6 className="text-sm font-semibold text-gray-500 text-left">Doctor</h6>
                    <p className="text-xs font-semibold text-gray-400 text-left">
                      {card?.doctor_id?.name || ""}
                    </p>


                  </div>
                </div>


                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center rounded-full bg-gray-100 text-gray-800 w-10 h-10">
                    <FaInfoCircle className="text-blue-600" />
                  </span>
                  <div>
                    <h6 className="text-sm font-semibold text-gray-500 text-left">Status</h6>
                    <p className="text-xs font-semibold text-gray-400 text-left">
                      {currentCard?.status || ""}
                    </p>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vital Signs Section */}
         <div className="xl:col-span-7 flex">
                    <div className="bg-white shadow-xs rounded-sm border border-gray-200 w-full">
                        <div className="border-b border-gray-200 px-4 py-3">
                            <h5 className="font-semibold text-md text-gray-600 flex items-center gap-2">
                                <FaNotesMedical /> Vital Signs {lastvitals?.lastAddedDate ? lastvitals.lastAddedDate.split(" ")[0] : "N/A"}
                            </h5>

                        </div>
                        <div className="p-4 pb-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Blood Pressure */}
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center rounded-md bg-gray-100 text-gray-800 w-10 h-10">
                                        <i className="ti ti-droplet text-lg"></i>
                                    </span>
                                    <div>
                                        <h6 className="text-sm font-semibold text-gray-500 text-left">Blood Pressure</h6>
                                        <p className="text-xs font-semibold text-gray-400 text-left">
                                            <i className="ti ti-point-filled text-green-500 mr-1"></i>
                                            {lastvitals["Blood Pressure"] || "N/A"} mmHg
                                        </p>
                                    </div>
                                </div>

                                {/* Heart Rate */}
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center rounded-md bg-gray-100 text-gray-800 w-10 h-10">
                                        <FaHeartbeat className="text-blue-600" />
                                    </span>
                                    <div>
                                        <h6 className="text-sm font-semibold text-gray-500 text-left">Heart Rate</h6>
                                        <p className="text-xs font-semibold text-gray-400 text-left">
                                            <i className="ti ti-point-filled text-red-500 mr-1"></i>
                                            {lastvitals["Heart Rate"] || "N/A"} Bpm
                                        </p>
                                    </div>
                                </div>

                                {/* SPO2 */}
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center rounded-md bg-gray-100 text-gray-800 w-10 h-10">
                                        <i className="ti ti-hexagons text-lg"></i>
                                    </span>
                                    <div>
                                        <h6 className="text-sm font-semibold text-gray-500 text-left">SPO2</h6>
                                        <p className="text-xs font-semibold text-gray-400 text-left">
                                            <i className="ti ti-point-filled text-green-500 mr-1"></i>
                                            {lastvitals["SPO2"] || "N/A"} %
                                        </p>
                                    </div>
                                </div>

                                {/* Temperature */}
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center rounded-md bg-gray-100 text-gray-800 w-10 h-10">
                                        <FaTemperatureHigh className="text-blue-600" />
                                    </span>
                                    <div>
                                        <h6 className="text-sm font-semibold text-gray-500 text-left">Temperature</h6>
                                        <p className="text-xs font-semibold text-gray-400 text-left">
                                            <i className="ti ti-point-filled text-green-500 mr-1"></i>
                                            {lastvitals["Temperature"] || "N/A"} °C
                                        </p>
                                    </div>
                                </div>

                                {/* Respiratory Rate */}
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center rounded-md bg-gray-100 text-gray-800 w-10 h-10">
                                        <i className="ti ti-activity text-lg"></i>
                                    </span>
                                    <div>
                                        <h6 className="text-sm font-semibold text-gray-500 text-left">Respiratory Rate</h6>
                                        <p className="text-xs font-semibold text-gray-400 text-left">
                                            <i className="ti ti-point-filled text-red-500 mr-1"></i>
                                            {lastvitals["Respiratory Rate"] || "N/A"} rpm
                                        </p>
                                    </div>
                                </div>

                                {/* Weight */}
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center rounded-md bg-gray-100 text-gray-800 w-10 h-10">
                                        <i className="ti ti-weight text-lg"></i>
                                    </span>
                                    <div>
                                        <h6 className="text-sm font-semibold text-gray-500 text-left">Weight</h6>
                                        <p className="text-xs font-semibold text-gray-400 text-left">
                                            <i className="ti ti-point-filled text-green-500 mr-1"></i>
                                            {lastvitals["Weight"] || "N/A"} kg
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
      </div>



      <div className="bg-white border border-gray-200 rounded-sm shadow-xs flex flex-col overflow-hidden mb-3">
        <TabView className="custom-tabs">
          <TabPanel header="Previous Appointment" leftIcon="pi pi-calendar mr-2">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {previousAppointments.length > 0 ? (
                  previousAppointments.map((appt, idx) => (
                    <div
                      key={appt._id || idx}
                      className="bg-white rounded-md p-4 border border-gray-200 cursor-pointer hover:shadow-md transition w-full h-full"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-2">
                        <p className="text-sm font-medium text-gray-500 text-left">
                          <span className="font-semibold">{appt.code || "No Code"}</span>
                          <br />
                          <span className="text-xs text-gray-400">
                            With Doctor {appt.doctor_id?.name || "Unknown"}
                          </span>
                        </p>

                        <span
                          className={`text-xs px-3 py-1 rounded-md ${appt.status === "Pending"
                            ? "bg-red-100 text-red-600"
                            : appt.status === "Confirmed"
                              ? "bg-green-100 text-green-600"
                              : appt.status === "Cancelled"
                                ? "bg-yellow-100 text-yellow-600"
                                : appt.status === "Completed"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-200 text-gray-600"
                            }`}
                        >
                          {appt.status}
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
                              {appt.patient_id?.name || "Unknown"}
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
                              {appt.patient_id?.phone || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-center gap-2 ">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                          <FaCalendarAlt className="text-gray-600 w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 text-left">Date and time</p>
                          <p className="text-sm font-medium text-gray-600">
                            {appt.appointmentDate || "N/A"}
                          </p>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-md">
                          {appt.timeSlot || "N/A"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm col-span-full">
                    No previous appointments found.
                  </p>
                )}
              </div>
            </div>
          </TabPanel>
 
          <TabPanel header="Prescription" leftIcon="pi pi-calendar mr-2">
            <div className="flex justify-end">
              <button className="bg-indigo-700 hover:bg-indigo-800 mb-2 text-white px-4 py-1 text-sm rounded-md flex items-center space-x-2" onClick={() => setVisible(true)}>
                <FaCloudUploadAlt />
                <span>Upload Your Prescription</span>
              </button>


              <Dialog header="Add Prescription" visible={visible} style={{ width: '30vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                <form className="space-y-4" onSubmit={handleSubmit}>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

                    <div>
                      <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                        Prescription <span className="text-red-500 font-bold">*</span>
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



                    <div>
                      <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                        Next Appointment Date <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="date"
                        value={nextAppointmentDate}
                        onChange={(e) => setNextAppointmentDate(e.target.value)}
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
              </Dialog>
            </div>

            <div className="grid grid-cols-12 gap-4">
              {prescription.length > 0 ? (
                prescription.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2"
                  >
                    <div className="bg-gray-100 rounded-sm shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition w-full">
                      {/* Prescription Image */}
                      <img
                        src={item.prescriptionImage || userImg}
                        alt="prescription"
                        className="w-full h-20 rounded-t-sm object-cover ring-2 ring-gray-200 cursor-pointer"
                        onClick={() => setSelectedImage(item.prescriptionImage || userImg)}
                      />

                      {/* Date Footer */}
                      <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center gap-2 rounded-b-sm">
                        <FaCalendarAlt className="text-gray-600 w-4 h-4" />
                        <p className="text-sm font-semibold text-gray-700">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            : "N/A"}
                        </p>

                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-12 text-gray-500 text-sm">No prescriptions found.</p>
              )}
            </div>




          </TabPanel>
 
          <TabPanel header="Lab Report" leftIcon="pi pi-calendar mr-2">
            <div className="flex justify-end mb-3">
              <button
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-1 text-sm rounded-md flex items-center space-x-2"
                onClick={() => setVisible(true)}
              >
                <FaCloudUploadAlt /><span>Add Your Lab Report</span>
              </button>

              {/* Add Lab Report Modal */}
              <Dialog header="Add Lab Report" visible={visible} style={{ width: "30vw" }} onHide={() => setVisible(false)}>
                <form className="space-y-4" onSubmit={handleLabReportSubmit}>
                  {["reportDate", "reportType", "labName", "remarks"].map((field, key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {field === "reportDate" ? "Report Date" : field === "reportType" ? "Report Type" : field === "labName" ? "Lab Name" : "Remark"}
                        {field !== "remarks" && <span className="text-red-500 font-bold">*</span>}
                      </label>
                      <input
                        type={field === "reportDate" ? "date" : "text"}
                        value={labreportselect[field] || ""}
                        onChange={(e) => setLabreportselect({ ...labreportselect, [field]: e.target.value })}
                        className="form-input w-full border rounded px-2 py-1"
                        required={field !== "remarks"}
                      />
                    </div>
                  ))}

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Report <span className="text-red-500 font-bold">*</span></label>
                    <input type="file" className="hidden" id="lab-upload" multiple accept="image/*,application/pdf" onChange={handleLabFileChange} />
                    <label htmlFor="lab-upload" className="flex flex-col justify-center items-center w-full h-14 border-2 border-dashed border-gray-200 rounded cursor-pointer hover:text-blue-400 transition">
                      <LuCloudUpload className="text-sm" /><span className="text-sm font-sm">Upload Files</span>
                    </label>

                    <div className="flex flex-wrap gap-3 mt-3">
                      {labFiles.map((item, idx) => (
                        <div key={idx} className="relative w-12 h-12">
                          {item.type === "pdf" ? (
                            <div
                              className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-full bg-gray-100 text-red-600 text-xs font-bold cursor-pointer"
                              onClick={() => setPreviewModal({ open: true, type: "pdf", url: URL.createObjectURL(item.file) })}
                            >
                              PDF
                            </div>
                          ) : (
                            <img
                              src={item.preview}
                              alt="Preview"
                              className="w-12 h-12 object-cover rounded-full border border-gray-300 cursor-pointer"
                              onClick={() => setPreviewModal({ open: true, type: "image", url: item.preview })}
                            />
                          )}
                          <button
                            type="button"
                            className="absolute -top-1 -right-1 text-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-100"
                            onClick={() => {
                              const updated = [...labFiles];
                              updated.splice(idx, 1);
                              setLabFiles(updated);
                            }}
                          >
                            <LuCircleX />
                          </button>
                        </div>
                      ))}
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
              </Dialog>
            </div>

            {/* Existing Lab Reports */}
            <div className="grid grid-cols-12 gap-4">
              {labreport.length ? labreport.map(report => (
                <div key={report._id} className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                  <div className="bg-gray-100 rounded-md shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">{report.code}</p>
                      <p className="text-xs text-gray-500">{report.reportType}</p>
                      <p className="text-xs text-gray-400">{new Date(report.reportDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-3">
                      {report.reportFiles.map(file => (
                        <div key={file._id} className="bg-white border rounded-sm flex items-center justify-center cursor-pointer p-2 hover:shadow"
                          onClick={() => file.fileType === "image" ? setPreviewModal({ open: true, type: "image", url: file.fileUrl }) : setPreviewModal({ open: true, type: "pdf", url: file.fileUrl })}>
                          {file.fileType === "image" ? <img src={file.fileUrl} alt="report" className="h-20 w-full object-cover rounded-sm" /> :
                            <div className="flex flex-col items-center justify-center"><FaFilePdf className="text-red-600 w-10 h-10" /><p className="text-xs mt-1">PDF</p></div>}
                        </div>
                      ))}
                    </div>
                    <div className="bg-white border-t px-3 py-2 text-xs text-gray-600">Remarks: <span className="font-medium">{report.remarks}</span></div>
                  </div>
                </div>
              )) : <p className="col-span-12 text-gray-500 text-sm">No lab reports found.</p>}
            </div>

            {/* Preview Modal */}
            {previewModal.open && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setPreviewModal({ open: false, type: "", url: "" })}>
                <div className="relative" onClick={e => e.stopPropagation()}>
                  {previewModal.type === "image" ? <img src={previewModal.url} alt="Preview" className="max-w-full max-h-[90vh] rounded-lg shadow-lg" /> :
                    <iframe src={previewModal.url} className="w-[80vw] h-[80vh] rounded-lg shadow-lg" title="PDF Preview"></iframe>}
                  <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md" onClick={() => setPreviewModal({ open: false, type: "", url: "" })}>✕</button>
                </div>
              </div>
            )}
          </TabPanel>


          <TabPanel header="Vitals" leftIcon="pi pi-calendar mr-2">
            <div className="flex justify-end mb-3">
              <button
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-1 text-sm rounded-md flex items-center space-x-2"
                onClick={() => setVisible(true)}
              >
                <FaPlusCircle /><span>Add Vitals</span>
              </button>

              {/* Add vitals Modal */}
              <Dialog header="Add Vitals" visible={visible} style={{ width: "30vw" }} onHide={() => setVisible(false)}>
                <form className="space-y-4" onSubmit={handleVitalsSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                      Select Unit <span className="text-red-500 font-bold">*</span>
                    </label>

                    <Select
                      options={units}                // ✅ units already contains full data
                      value={selectedUnit}
                      onChange={handleUnitChange}
                      placeholder={loading ? "Loading units..." : "Select Units"}
                      styles={customSelectStyles}
                      isDisabled={loading}
                      required
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />

                    {/* ✅ Show ranges */}
                    {selectedUnit && (
                      <div className="mt-2 text-xs text-blue-500 font-medium">
                        Normal Range: {selectedUnit.normal_range} {selectedUnit.unit} |{" "}
                        Global Range: {selectedUnit.global_range} {selectedUnit.unit}
                      </div>
                    )}
                  </div>
 

                  <div>
                    <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                      Patient Range <span className="text-red-500 font-bold">*</span>
                    </label>

                    <input
                      type="text"
                      value={range}
                      onChange={(e) => setRange(e.target.value)}
                      className="form-input"
                      required
                    />

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
              </Dialog>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {vitals.length > 0 ? (
                  vitals.map((vital, idx) => (
                    <div
                      key={vital._id || idx}
                      className="bg-white rounded-md p-4 border border-gray-200 cursor-pointer hover:shadow-md transition w-full h-full"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-2">
                        <p className="text-sm font-medium text-gray-500 text-left">
                          <span className="font-semibold text-blue-600">{vital.health_code || "N/A"}</span> <br />
                          <span className="text-xs text-gray-400">
                            {vital.parameter_name || "Unknown Vital"}
                          </span>
                        </p>
                      </div>

                      {/* First row */}
                      <div className="flex items-center justify-between pb-2 mb-2">
                        <div>
                          <p className="text-xs text-gray-500 text-left">Normal Range</p>
                          <p className="text-sm font-medium text-gray-600 text-left">
                            {vital.normal_range || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 text-left">Global Range</p>
                          <p className="text-sm font-medium text-gray-600 text-left">
                            {vital.global_range || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Vital value */}
                      <div className="flex items-center">
                        <div>
                          <p className="text-xs text-gray-500 text-left">Patient Range</p>
                          <p className="text-sm font-medium text-gray-600 text-left">
                            {vital.patient_range || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-12 text-gray-500 text-sm">No vitals found.</p>
                )}
              </div>
            </div>
          </TabPanel>



{loading ? (
  <p>Loading...</p>
) : medicalHistory ? (
  <TabPanel header="Medical History" leftIcon="pi pi-calendar mr-2">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <div className="bg-white rounded-md p-4 border border-gray-200 cursor-pointer hover:shadow-md transition w-full h-full">
            {/* Patient Info */}
            <div className="flex items-center justify-between pb-2 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                  {medicalHistory.patient_id?.name?.[0] || "P"}
                </div>
                <div>
                  <p className="text-xs text-gray-500 text-left">Patient Name</p>
                  <p className="text-sm font-medium text-gray-600 text-left">
                    {medicalHistory.patient_id?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                  <FaPhoneAlt className="text-gray-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 text-left">Phone Number</p>
                  <p className="text-sm font-medium text-gray-600 text-left">
                    {medicalHistory.patient_id?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                <FaCalendarAlt className="text-gray-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 text-left">Date and Time</p>
                <p className="text-sm font-medium text-gray-600">
                  {new Date(medicalHistory.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-md">
                {new Date(medicalHistory.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* Section One */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Section One</h3>
              {Object.entries(medicalHistory.sectionOne).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm text-gray-600 mb-1">
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span>{Array.isArray(value) ? value.join(", ") : value}</span>
                </div>
              ))}
            </div>

            {/* Family History */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Family History</h3>
              {medicalHistory.familyHistory.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{item.disease} ({item.familyMembers})</span>
                </div>
              ))}
            </div>

            {/* Hospitalization */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Hospitalization</h3>
              {medicalHistory.hospitalization.map((item, idx) => (
                <div key={idx} className="flex flex-col text-sm text-gray-600 mb-1">
                  <span>Date: {item.monthYear}</span>
                  <span>Reason: {item.reason}</span>
                  <span>Hospital: {item.hospital}</span>
                </div>
              ))}
            </div>

            {/* Guardian Info */}
            <div>
              <h3 className="font-semibold text-sm mb-2">Guardian Info</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Name</span>
                <span>{medicalHistory.guardianInfo.parentOrGuardianName || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Relationship</span>
                <span>{medicalHistory.guardianInfo.relationshipToPatient || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabPanel>
) : (
  <p>No medical history found.</p>
)}



        </TabView>
      </div>



      {selectedImage && (
        <div
          className="fixed inset-0 bg-gray-50 bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)} // close on click
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full Prescription"
              className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}



    </>
  );
}