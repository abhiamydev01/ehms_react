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
    async getAllNures() {
        return this.get("/auth/api/getAllNures");
    }
    async getGVRReports() {
        return this.get("/auth/api/getGVRReports");
    }
    async getDoctorSlots(payload) {
        return this.post("/auth/api/getDoctorSlots", payload);
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




}

export default new ApiService("http://10.10.60.10:9027");


////https://ehmr-node.onrender.com/auth/api/login


///http://10.10.60.10:9027
