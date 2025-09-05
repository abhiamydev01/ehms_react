import { useParams, Navigate } from "react-router-dom";
import { decryptRoute } from "./routeEncryptor";

import DashboardHome from "../pages/DashboardHome";
import Doctor from "../pages/doctor";
import Nurse from "../pages/nurse";
import Appointment from "../pages/appoinment";
import Patient from "../pages/patient";
import Prescription from "../pages/prescription";
import Master from "../pages/masterSetup";
import Hospital from "../pages/hospital";
import HospitalCreate from "../pages/hospitalcreate";
import Department from "../pages/department";
import DeptCreate from "../pages/deptcreate";
import Qualification from "../pages/qualification";
import QuaCreate from "../pages/quacreate";
import Specialization from "../pages/specialization";
import SpecialAdd from "../pages/specailadd";
import DoctorAdd from "../pages/doctorcreate";
import NurseAdd from "../pages/nursecreate";
import DocSchedule from "../pages/docschedule"; 
import DocsheduleAdd from "../pages/docscheduleadd";
import Gvrlist from "../pages/gvr";
import GvrAdd from "../pages/gvrAdd";
 
 

export default function DynamicPage() {
  const { encrypted, subEncrypted } = useParams();

  const main = decryptRoute(encrypted);
  const sub = subEncrypted ? decryptRoute(subEncrypted) : null;

  if (!main) return <Navigate to="/" replace />;

  if (main === "dashboard" && !sub) return <DashboardHome />;
  if (main === "doctor") return <Doctor />;
  if (main === "create-doctor") return <DoctorAdd />;
  if (main === "doc-schedule") return <DocSchedule />;
  if (main === "create-docshedule") return <DocsheduleAdd />;
  if (main === "create-nurse") return <NurseAdd />;
  if (main === "nurse" && !sub) return <Nurse />;
  if (main === "nurse" && sub === "appointment") return <Appointment />;
  if (main === "nurse" && sub === "patient") return <Patient />;
  if (main === "nurse" && sub === "prescription") return <Prescription />;
  if (main === "master" && sub === "hospital") return <Hospital />;
  if (main === "master" && sub === "department") return <Department />;
  if (main === "master" && sub === "create-department") return <DeptCreate />;
  if (main === "master" && sub === "create-hospital") return <HospitalCreate />;
  if (main === "master" && sub === "qualification") return <Qualification />;
  if (main === "master" && sub === "create-qualification") return <QuaCreate />;
  if (main === "master" && sub === "specialization") return <Specialization />;
  if (main === "master" && sub === "create-specialization") return <SpecialAdd />;
  if (main === "master" && sub === "create-gvr") return <GvrAdd />;
  if (main === "master" && sub === "gvr") return <Gvrlist />;


  return <Navigate to="/" replace />;
}
