// /src/utils/ApiService.js
import axios from "axios";

class ApiService {
    constructor(baseURL) {
        this.client = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    async get(endpoint, params = {}) {
        return this.client.get(endpoint, { params });
    }

    async post(endpoint, data) {
        return this.client.post(endpoint, data);
    }

    async put(endpoint, data) {
        return this.client.put(endpoint, data);
    }

    async delete(endpoint) {
        return this.client.delete(endpoint);
    }

    // Custom method for hospitals
    async getAllHospitals() {
        return this.get("/auth/api/getAllHospitals");
    }
    async getAllHospitalDoctors(hospitalId) {
        return this.post("/auth/api/getAllHospitalDoctor", {
            hospital_id: hospitalId,
        });
    }


    async signIn(payload) {
        return this.post("/auth/api/login", payload);
    }
    async addDepartment(payload) {
        return this.post("/auth/api/addDepartment", payload);
    }
    async addGVRReports(payload) {
        return this.post("/auth/api/addGVRReports", payload);
    }
    async addQualification(payload) {
        return this.post("/auth/api/addQualification", payload);
    }

    async addSpecialization(payload) {
        return this.post("/auth/api/addSpecialization", payload);
    }

    async getAllDepartments() {
        return this.get("/auth/api/getAllDepartment");
    }


    async getAllSpecializations() {
        return this.get("/auth/api/getAllSpecializations");
    }
    async getAllQualification() {
        return this.get("/auth/api/getAllQualification");
    }
    async getAllDoctorList() {
        return this.get("/auth/api/getAllDoctorList");
    }

    async getDoctorsByDate(date) {
        return this.post("/auth/api/getDoctorsByDate", { date });
    }


    async getAllNures() {
        return this.get("/auth/api/getAllNures");
    }
    async getGVRReports() {
        return this.get("/auth/api/getGVRReports");
    }
    async getDoctorPaymentDetails() {
        return this.get("/auth/api/getDoctorPaymentDetails");
    }
    async getDoctorSlots(payload) {
        return this.post("/auth/api/getDoctorSlots", payload);
    }
    async getLastVitalsDetails(payload) {
        return this.post("/auth/api/getLastVitalsDetails", payload);
    }
    async getPatientList() {
        return this.get("/auth/api/getPatientList");
    }
    async getPatientDoctorAndHospitalDoctors() {
        return this.get("/auth/api/getPatientDoctorAndHospitalDoctors");
    }

    async getAllDoctorAppoinment(payload) {
        return this.post("/auth/api/getAllDoctorAppoinment", payload);
    }
    async getAllPatientAppointment(params) {
        return this.get("/auth/api/getAllPatientAppointment", params);
    }


    async addHospital(data) {
        return this.client.post("/auth/api/addhospital", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }


    async addDoctorSlot(payload) {
        return this.post("/auth/api/addDoctorSlot", payload);
    }
    async patientenroll(payload) {
        return this.post("/auth/api/add-patient", payload);
    }

    async addAppointment(payload) {
        return this.post("/auth/api/bookAppoinmentForPatient", payload);
    }
    async addHealthReports(payload) {
        return this.post("/auth/api/addHealthReports", payload);
    }

    async appointmentsAcceptCancelled(payload) {
        return this.post("/auth/api/appoinmentsAcceptCancelled", payload);
    }
    async getAppoinmentBasedOnPatient(payload) {
        return this.post("/auth/api/getAppoinmentBasedOnPatient", payload);
    }
    async getAllPrescriptionForPatient(payload) {
        return this.post("/auth/api/getAllPrescriptionForPatient", payload);
    }
    async getLapReportsBasedOnPatient(payload) {
        return this.post("/auth/api/getLapReportsBasedOnPatient", payload);
    }
    async getHealthReports(payload) {
        return this.post("/auth/api/getHealthReports", payload);
    }

    async updateAppointmentStatus(payload) {
        return this.post("/auth/api/updateAppointmentStatus", payload);
    }
    async doctorReg(data) {
        return this.client.post("/auth/api/registration", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    async nurseReg(data) {
        return this.client.post("/auth/api/registration", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
    async uploadAppointmentPrescriptionForPatient(data) {
        return this.client.post("/auth/api/uploadAppointmentPrescriptionForPatient", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
    async uploadLabReport(data) {
        return this.client.post("/auth/api/uploadLabReport", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    async getVitalsBasedOnPatient(payload) {
        return this.post("/auth/api/getVitalsBasedOnPatient", payload);
    }
    async addMedicalHistory(payload) {
        return this.post("/auth/api/addMedicalHistory", payload);
    }
    async getMedicalHistoryByPatient(payload) {
        return this.post("/auth/api/getMedicalHistoryByPatient", payload);
    }

}

export default new ApiService("http://10.10.10.21:9027");


////https://ehmr-node.onrender.com/auth/api/login

//https://ehmr-node.onrender.com


///http://10.10.60.64:9027
