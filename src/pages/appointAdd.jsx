import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from "../components/selectStyles.js";
import { FaBackward, FaUserMd } from "react-icons/fa";
import { LuCircleCheckBig } from "react-icons/lu";
import { useState, useEffect } from "react";
import ApiServices from "../utils/ApiServices.js";
import { encryptRoute } from "../components/routeEncryptor.js";
import Loader from "../components/loader";
import toast from "react-hot-toast";

const Status = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
];

const Appointment = [
  { value: "Online", label: "Virtual" },
  { value: "In-Person", label: "In-Person" },

];

export default function PatientAdd() {
  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  });

  const [doctor, setDoctor] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatients, setselectedPatients] = useState(null);
  const [slotOptions, setSlotOptions] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAppointment, setselectedAppointment] = useState(Appointment[1]);
  const [selectedStatus, setselectedStatus] = useState(Status[0]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");


  const location = useLocation();
  const card = location.state?.card;
  const initialDoctorId = card?._id;

  console.log("Doctor ID:", initialDoctorId);

  const navigate = useNavigate();

  // fetch doctors by date
  useEffect(() => {
    const fetchDoctor = async () => {
      setLoadingDoctors(true);
      try {
        const res = await ApiServices.getDoctorsByDate(date);
        const fetchedDoctors = res.data.doctors || [];

        // Preselect doctor if coming from card
        if (initialDoctorId) {
          const doctorExists = fetchedDoctors.find(d => d.doctor._id === initialDoctorId);
          if (doctorExists) {
            setSelectedDoctor(doctorExists); // store the object, not just ID
          } else {
            //  toast.error("Selected doctor is not available on this date.");
            setSelectedDoctor(null);
          }
        }

        setDoctor(fetchedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctor([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    if (date) fetchDoctor();
  }, [date]);

  // useEffect(() => {
  //   const fetchDoctor = async () => {
  //     setLoadingDoctors(true);
  //     try {
  //       const res = await ApiServices.getDoctorsByDate(date);
  //       console.log("Sending date:", date);
  //       const fetchedDoctors = res.data.doctors || [];
  //       setDoctor(fetchedDoctors);
  //       if (initialDoctorId) {
  //         const exists = fetchedDoctors.find((d) => d.doctor._id === initialDoctorId);

  //         if (exists) {
  //           // doctor is available, preselect
  //           setSelectedDoctor(initialDoctorId);
  //         } else {
  //           // doctor not available on this date
  //           toast.error("Selected doctor is not available on this date.");
  //           setSelectedDoctor(null);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching doctors:", error);
  //       setDoctor([]);
  //     } finally {
  //       setLoadingDoctors(false);
  //     }
  //   };

  //   if (date) fetchDoctor();
  // }, [date]);

  // fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await ApiServices.getPatientList();
        const patients = res.data.data.map((pat) => ({
          value: pat._id,
          label: pat.name,
        }));
        setPatients(patients);
      } catch (error) {
        console.log("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // update slots when doctor changes
  useEffect(() => {
    if (!selectedDoctor) {
      setSlotOptions([]);
      return;
    }

    const slots = selectedDoctor.slots.map((slot) => ({
      value: slot,
      label: slot,
    }));
    setSlotOptions(slots);
    setSelectedSlot(null); // reset when doctor changes
  }, [selectedDoctor]);

  // useEffect(() => {
  //   if (!selectedDoctor) {
  //     setSlotOptions([]);
  //     return;
  //   }

  //   const selectedDoc = doctor.find((d) => d.doctor._id === selectedDoctor);
  //   if (selectedDoc) {
  //     const slots = selectedDoc.slots.map((slot) => ({
  //       value: slot,
  //       label: slot,
  //     }));
  //     setSlotOptions(slots);
  //     setSelectedSlot(null); // reset when doctor changes
  //   }
  // }, [selectedDoctor, doctor]);

  // --- handle form submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    //  setLoading(true);

    const localPatientId = localStorage.getItem("id");
    const localPatientphone = localStorage.getItem("phone");
    const role = localStorage.getItem("role");
    let payload = {};
    if (role === "nurse") {
      if (!date || !selectedDoctor || !selectedSlot || !selectedAppointment || !selectedStatus) {
        return toast.error("Please fill all required fields.");
      }

      payload = {
        doctor_id: selectedDoctor?.doctor?._id || null,  // ✅ only from selection
        //  patient_id: selectedPatients?.value || null, // ✅ nurse picks patient
        patient_number: mobileNumber,
        appointmentDate: date,
        timeSlot: selectedSlot?.value || null,
        appointment_type: selectedAppointment?.value || null,
        status: selectedStatus?.label || "Pending",
        reason: reason || "",
      };
    } else {
      if (!date || !initialDoctorId || !selectedSlot || !selectedAppointment || !selectedStatus) {
        return toast.error("Please fill all required fields.");
      }

      payload = {
        doctor_id: initialDoctorId || null,        // ✅ patient side uses doctor from card
        //patient_id: localPatientId || null, 
         patient_number: localPatientphone,
        appointmentDate: date,
        timeSlot: selectedSlot?.value || null,
        appointment_type: selectedAppointment?.value || null,
        status: selectedStatus?.label || "Pending",
        reason: reason || "",
      };
    }



    setSubmitting(true);

    console.log("Submitting payload:", payload);

    try {
      const res = await ApiServices.addAppointment(payload);
      console.log("Appointment booked:", res.data);
      toast.success("Appointment booked successfully!");
      setTimeout(() => {
        navigate(`/${encryptRoute("doctor")}/${encryptRoute("appointment")}`);
      }, 500);
    } catch (error) {
      console.error("Error booking appointment:", error);
      if (error.response) {
        toast.error(error.response.data?.message || "Server Error");
      } else {
        toast.error("Network Error");
      }
    } finally {
      setSubmitting(false);
    }
  };
  const DoctorCard = ({ entry, selectedDoctor, setSelectedDoctor }) => {
    const isSelected = selectedDoctor?.doctor?._id === entry.doctor._id;

    return (
      <div
        onClick={() => setSelectedDoctor(entry)}
        className={`bg-white border rounded-sm px-3 py-3 cursor-pointer shadow-sm transition-all duration-150
        ${isSelected ? "border-blue-500 ring-1 ring-blue-100" : "border-gray-200 hover:border-blue-300"}`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`w-4 h-4 mt-1 rounded-full border flex-shrink-0
            ${isSelected ? "bg-blue-600 border-blue-700" : "bg-white border-gray-300"}`}
          />
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-800 text-left">{entry.doctor?.name}</h3>
            <p className="text-xs text-blue-600 font-medium">{entry.doctor?.specialization?.join(", ")}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-end">
          <NavLink to={`/${encryptRoute("patient-enroll")}`}>
            <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-green-600">
              <FaBackward />
            </button>
          </NavLink>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left side: form inputs */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-xs px-5 py-2 mt-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                Date <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {!initialDoctorId && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                  Patient Mobile <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                />

              </div>

              // <div className="mb-3">
              //   <label className="block text-sm font-medium text-gray-600 text-left mb-1">
              //     Patient <span className="text-red-500 font-bold">*</span>
              //   </label>
              //   <Select
              //     options={patients}
              //     value={selectedPatients}
              //     onChange={setselectedPatients}
              //     placeholder={loading ? "Loading patients..." : "Select Patients"}
              //     styles={customSelectStyles}
              //     isDisabled={loading}
              //     required
              //   />
              // </div>
            )}



            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                Time Slot <span className="text-red-500 font-bold">*</span>
              </label>
              <Select
                options={slotOptions}
                value={selectedSlot}
                onChange={setSelectedSlot}
                placeholder={
                  selectedDoctor
                    ? "Select Time Slot"
                    : "Please select a doctor first"
                }
                styles={customSelectStyles}
                isDisabled={!selectedDoctor || loading}
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                Appointment <span className="text-red-500 font-bold">*</span>
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

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                Status <span className="text-red-500 font-bold">*</span>
              </label>
              <Select
                options={Status}
                value={selectedStatus}
                onChange={setselectedStatus}
                placeholder="Select status"
                styles={customSelectStyles}
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 text-left mb-1">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="form-input description-validation"
                rows="3"
                placeholder="Reason"
                maxLength="200"
              />
              <div className="char-count text-xs text-gray-500 text-right mt-1">
                {reason.length}/200
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`bg-blue-500 border text-white px-3 py-1 rounded-sm border-blue-500 flex items-center justify-center gap-1
                  ${submitting ? "opacity-50 cursor-not-allowed" : "hover:text-blue-500 hover:bg-transparent cursor-pointer"}
                      `}
              >
                <LuCircleCheckBig />
                <span className="text-sm font-medium">
                  {submitting ? "Submitting..." : "Submit"}
                </span>
              </button>

            </div>
          </div>

          {/* Right side: Doctor list */}
          {/* <div className="h-full overflow-y-auto flex flex-col gap-2 mt-4">
            {loadingDoctors && (
              <div className="flex flex-col items-center justify-center pb-2 bg-white border border-gray-200 rounded-sm shadow-sm">
                <Loader />
                <p className="mt-1 text-sm font-medium text-gray-400">
                  Loading doctors...
                </p>
              </div>
            )}

            {!loadingDoctors && doctor.length === 0 && (
              <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-md shadow-sm">
                <FaUserMd className="text-gray-300 w-12 h-12 mb-3" />
                <p className="text-sm font-medium text-gray-300">
                  No doctors available for this date
                </p>
              </div>
            )}

            {!loadingDoctors &&
              doctor.map((entry, idx) => {
                const id = entry?.doctor?._id ?? `doctor-${idx}`;
                const isSelected = selectedDoctor === id;

                return (
                  <div
                    key={id}
                    onClick={() => setSelectedDoctor(id)}
                    className={`bg-white border rounded-sm px-3 py-3 cursor-pointer shadow-sm transition-all duration-150
                    ${isSelected
                        ? "border-blue-500 ring-1 ring-blue-100"
                        : "border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-4 h-4 mt-1 rounded-full border flex-shrink-0
                        ${isSelected
                            ? "bg-blue-600 border-blue-700"
                            : "bg-white border-gray-300"
                          }`}
                      />
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-800 text-left">
                          {entry.doctor?.name}
                        </h3>
                        <p className="text-xs text-blue-600 font-medium">
                          {entry.doctor?.specialization?.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div> */}
          {/* <div className="h-full overflow-y-auto flex flex-col gap-2 mt-4">
            {loadingDoctors && (
              <div className="flex flex-col items-center justify-center pb-2 bg-white border border-gray-200 rounded-sm shadow-sm">
                <Loader />
                <p className="mt-1 text-sm font-medium text-gray-400">
                  Loading doctors...
                </p>
              </div>
            )}

            {!loadingDoctors && !doctor.find(d => d.doctor._id === initialDoctorId) && (
              <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 border border-yellow-200 rounded-md shadow-sm">
                <FaUserMd className="text-yellow-400 w-12 h-12 mb-3" />
                <p className="text-sm font-medium text-yellow-700">
                  The selected doctor is not available on this date.
                </p>
              </div>
            )}

            {!loadingDoctors && doctor.find(d => d.doctor._id === initialDoctorId) &&
              doctor
                .filter(d => d.doctor._id === initialDoctorId) // only show selected doctor
                .map((entry, idx) => {
                  const id = entry.doctor._id;
                  const isSelected = selectedDoctor?.doctor?._id === id;

                  return (
                    <div
                      key={id}
                      onClick={() => setSelectedDoctor(entry)}
                      className={`bg-white border rounded-sm px-3 py-3 cursor-pointer shadow-sm transition-all duration-150
              ${isSelected
                          ? "border-blue-500 ring-1 ring-blue-100"
                          : "border-gray-200 hover:border-blue-300"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-4 h-4 mt-1 rounded-full border flex-shrink-0
                  ${isSelected
                              ? "bg-blue-600 border-blue-700"
                              : "bg-white border-gray-300"
                            }`}
                        />
                        <div className="flex flex-col">
                          <h3 className="text-sm font-semibold text-gray-800 text-left">
                            {entry.doctor?.name}
                          </h3>
                          <p className="text-xs text-blue-600 font-medium">
                            {entry.doctor?.specialization?.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div> */}

          <div className="h-full overflow-y-auto flex flex-col gap-2 mt-4">

            {initialDoctorId ? (
              (() => {
                const selectedDoc = doctor.find(d => d.doctor._id === initialDoctorId);
                if (selectedDoc) {
                  return (
                    <DoctorCard
                      key={selectedDoc.doctor._id}
                      entry={selectedDoc}
                      selectedDoctor={selectedDoctor}
                      setSelectedDoctor={setSelectedDoctor}
                    />
                  );
                } else {
                  return (
                    <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-sm shadow-sm">
                      <FaUserMd className="text-gray-300 w-12 h-12 mb-3" />
                      <p className="text-sm font-medium text-gray-300">
                        The selected doctor is not available on this date.
                      </p>
                    </div>
                  );
                }
              })()
            ) : doctor.length > 0 ? (   // ✅ check doctor length here
              doctor.map((entry) => (
                <DoctorCard
                  key={entry.doctor._id}
                  entry={entry}
                  selectedDoctor={selectedDoctor}
                  setSelectedDoctor={setSelectedDoctor}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-sm shadow-sm">
                <FaUserMd className="text-gray-300 w-12 h-12 mb-3" />
                <p className="text-sm font-medium text-gray-300">
                  No doctors available on the selected date.
                </p>
              </div>
            )}

          </div>

        </div>
      </form>

      <Outlet />
    </>
  );
}
