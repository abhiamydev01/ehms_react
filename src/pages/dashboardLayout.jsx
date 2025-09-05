import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useParams,useNavigate   } from "react-router-dom";
import { encryptRoute, decryptRoute } from "./../components/routeEncryptor";
import { FaUserMd, FaUserClock, FaUserNurse, FaUsersCog, FaHome } from "react-icons/fa";
import {
  LuLayoutGrid,
  LuChevronDown,
  LuChevronUp,
  LuList,
  LuBell,
  LuCircleUserRound,
  LuLock,
  LuLogOut,
  LuX,
} from "react-icons/lu";

const notifications = [
  { id: 1, message: "Leave Request (LR-00733) is Approved by Lal Singh", date: "28-06-2025", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, message: "Leave Request (LR-00855) is Approved by Lal Singh", date: "04-08-2025", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, message: "HalfDay Leave Request (LR-00702) is Approved by Lal Singh", date: "29-05-2025", avatar: "https://i.pravatar.cc/40?img=3" },
];

const TITLES = {
  dashboard: "Dashboard",
  doctor: "Doctor",
  "create-doctor": "Add Doctor",
  "create-nurse": "Add Nurse",
  "nurse": "Nurse",
  "doc-schedule": "Schedule",
  "create-docshedule": "Add Schedule",
  "nurse-appointment": "Appointment",
  "nurse-patient": "Patient",
  "nurse-prescription": "Prescription",
  "master-hospital": "Hospital",
  "master-department": "Department",
  "master-create-department": "Add Department",
  "master-create-hospital": "Add Hospital",
  "master-qualification": "Qualification",
  "master-create-qualification": "Add Qualification",
  "master-specialization": "Specialization",
  "master-gvr": "Gvr",
  "master-create-gvr": "Gvr Add",

};

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [nurseMenuOpen, setNurseMenuOpen] = useState(false);
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);

  const notifyRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();

  // 🔑 Read encrypted params and decrypt them
  const { encrypted, subEncrypted } = useParams();
  const main = encrypted ? decryptRoute(encrypted) : null;
  const sub = subEncrypted ? decryptRoute(subEncrypted) : null;

  // 🏷️ Compute a key for titles based on decrypted values
  const titleKey =
    main === "nurse" && sub
      ? `nurse-${sub}`
      : main === "master" && sub
        ? `master-${sub}`
        : main || "";

  const headerTitle = TITLES[titleKey] || "EHMS";

  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔹 Clear stored auth data
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");

    // 🔹 Redirect to login page
    navigate("/", { replace: true });
  };

  // 🔤 Set the document title when route changes
  useEffect(() => {
    document.title = TITLES[titleKey] ? `${TITLES[titleKey]} - EHMS` : "EHMS";
  }, [titleKey]);

  // 📱 Open sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔒 Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifyRef.current && !notifyRef.current.contains(e.target)) setNotifyOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📂 Keep submenus open based on decrypted section
  useEffect(() => {
    setNurseMenuOpen(main === "nurse");
    setMasterMenuOpen(main === "master");
  }, [main, location.pathname]);

  const NavItem = ({ icon: Icon, label, to, matchKey, sidebarOpen }) => {
  // matchKey is used to check against decrypted "main"
  const isActive = main === matchKey;

  return (
    <li className="relative group my-2 rounded-r">
      <NavLink
        to={to}
        className={classNames(
          "flex items-center text-sm font-medium rounded-r transition-colors",
          sidebarOpen ? "justify-start gap-3 px-3 py-2" : "justify-center p-2",
          isActive
            ? "bg-gray-100 text-blue-600 border-l-4 border-blue-500"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        )}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {sidebarOpen && <span className="truncate">{label}</span>}
      </NavLink>

      {/* Tooltip when sidebar is collapsed */}
      {!sidebarOpen && (
        <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 shadow">
          {label}
        </span>
      )}
    </li>
  );
};



  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Overlay for mobile */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={classNames(
          "bg-white shadow-xs flex flex-col py-4 border-r border-gray-200 transition-all duration-300 overflow-hidden fixed inset-y-0 z-40 lg:static",
          sidebarOpen ? "w-64 left-0" : "-left-64 lg:w-16 lg:left-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="border-b border-gray-200 shadow-xs pb-3 mb-5 flex items-center justify-between px-4">
          {sidebarOpen ? (
            <h1 className="text-3xl  font-bold text-blue-500 tracking-widest">EHMS</h1>
          ) : (
            <span className="text-blue-500 font-bold text-2xl">E</span>
          )}
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <LuX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3">
          <ul className="space-y-1">
            {/* 🔐 Encrypted top-level links */}
          
            <NavItem
  icon={FaHome}
  label="Dashboard"
  to={`/${encryptRoute("dashboard")}`}
  matchKey="dashboard"
  sidebarOpen={sidebarOpen}
/>
<NavItem
  icon={FaUserMd}
  label="Doctor"
  to={`/${encryptRoute("doctor")}`}
  matchKey="doctor"
  sidebarOpen={sidebarOpen}
/>
<NavItem
  icon={FaUserClock}
  label="Doctor Schedule"
  to={`/${encryptRoute("doc-schedule")}`}
  matchKey="doc-schedule"
  sidebarOpen={sidebarOpen}
/>
<NavItem
  icon={FaUserNurse}
  label="Nurse"
  to={`/${encryptRoute("nurse")}`}
  matchKey="nurse"
  sidebarOpen={sidebarOpen}
/>


           

            {/* Master Setup Menu */}
            <li className="rounded-r">
              <button
  type="button"
  onClick={() => setMasterMenuOpen(v => !v)}
  className={classNames(
    "w-full text-left flex items-center text-sm font-medium rounded-r",
    sidebarOpen ? "justify-between px-3 py-2" : "justify-center p-2",
    main === "master" ? "bg-gray-100 text-blue-600 border-l-4 border-blue-500" : "text-gray-600 hover:bg-gray-100"
  )}
>
  <div className={classNames("flex items-center", sidebarOpen && "gap-3")}>
    <FaUsersCog className="w-5 h-5 shrink-0" />
    {sidebarOpen && <span className="truncate">Master Setup</span>}
  </div>
  {sidebarOpen && (masterMenuOpen ? <LuChevronUp className="w-4 h-4" /> : <LuChevronDown className="w-4 h-4" />)}
</button>

            

              {sidebarOpen && masterMenuOpen && (
                <ul className="ml-5 text-gray-500">
                  <li>
                    <NavLink
                      to={`/${encryptRoute("master")}/${encryptRoute("hospital")}`}
                      className={({ isActive }) =>
                        classNames("flex items-center text-sm cursor-pointer p-2 rounded", isActive ? "bg-gray-100" : "hover:bg-gray-100")
                      }
                    >
                      <span className="w-3 h-3 rounded-full border-2 border-blue-500 mr-2"></span>
                      Hospital
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/${encryptRoute("master")}/${encryptRoute("department")}`}
                      className={({ isActive }) =>
                        classNames("flex items-center text-sm cursor-pointer p-2 rounded", isActive ? "bg-gray-100" : "hover:bg-gray-100")
                      }
                    >
                      <span className="w-3 h-3 rounded-full border-2 border-blue-500 mr-2"></span>
                      Department
                    </NavLink>
                  </li>


                  <li>
                    <NavLink
                      to={`/${encryptRoute("master")}/${encryptRoute("qualification")}`}
                      className={({ isActive }) =>
                        classNames("flex items-center text-sm cursor-pointer p-2 rounded", isActive ? "bg-gray-100" : "hover:bg-gray-100")
                      }
                    >
                      <span className="w-3 h-3 rounded-full border-2 border-blue-500 mr-2"></span>
                      Qualification
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/${encryptRoute("master")}/${encryptRoute("specialization")}`}
                      className={({ isActive }) =>
                        classNames("flex items-center text-sm cursor-pointer p-2 rounded", isActive ? "bg-gray-100" : "hover:bg-gray-100")
                      }
                    >
                      <span className="w-3 h-3 rounded-full border-2 border-blue-500 mr-2"></span>
                      Specialization
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/${encryptRoute("master")}/${encryptRoute("gvr")}`}
                      className={({ isActive }) =>
                        classNames("flex items-center text-sm cursor-pointer p-2 rounded", isActive ? "bg-gray-100" : "hover:bg-gray-100")
                      }
                    >
                      <span className="w-3 h-3 rounded-full border-2 border-blue-500 mr-2"></span>
                      Global Virtual Range
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex justify-between items-center p-3 bg-white shadow-xs border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded hover:bg-gray-100" onClick={() => setSidebarOpen((v) => !v)} aria-label="Toggle sidebar">
              <LuList className="w-6 h-6 text-gray-600" />
            </button>
            {/* ✅ Use decrypted title */}
            <h2 className="font-semibold text-xl text-gray-600">{headerTitle}</h2>
          </div>

          {/* Notifications & Profile */}
          <div className="flex items-center gap-4 relative pr-4" ref={notifyRef}>
            <button
              className="p-2 rounded hover:bg-gray-100 relative"
              onClick={() => {
                setNotifyOpen((v) => !v);
                setProfileOpen(false);
              }}
              aria-label="Open notifications"
            >
              <LuBell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center">
                {notifications.length}
              </span>
            </button>


            {/* ... profile dropdown unchanged ... */}
            {notifyOpen && (
              <div className="absolute right-20 top-10 w-120 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="flex justify-between items-center p-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-600">Notifications</h3>
                  <button className="text-blue-600 text-sm hover:underline">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-none"
                    >
                      <img
                        src={n.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">
                          {n.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {n.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile dropdown */}
            <div
              ref={profileRef}
              className="relative p-[3px] rounded-full ring-2 ring-gray-200 cursor-pointer hover:shadow-md"
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifyOpen(false);
              }}
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="User"
                className="w-8 h-8 rounded-full"
              />

              {profileOpen && (
                <div className="absolute right-0 top-10 w-70 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-500">
                      {localStorage.getItem("name") || "User"}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {localStorage.getItem("email") || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-3 py-2">
                      <LuCircleUserRound className="text-lg" />
                      <span className="text-[15px] text-gray-500">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-3 py-2">
                      <LuLock className="text-lg" />
                      <span className="text-[15px] text-gray-500">
                        Change Password
                      </span>
                    </button>
                    <button  onClick={handleLogout} className="w-full flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-3 py-2">
                      <LuLogOut className="text-lg" />
                      <span className="text-[15px] text-gray-500">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>



          </div>


        </header>

        <main className="flex-1 p-5 overflow-y-auto">
          <Outlet />
        </main>

        <footer className="flex justify-between items-center p-4 bg-white shadow-sm border-t border-gray-200">
          <span className="text-sm text-gray-500">© 2025 EHMS. All rights reserved.</span>
          <span className="text-sm text-gray-400">v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}
