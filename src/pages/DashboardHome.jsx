import { Outlet } from "react-router-dom";


export default function DashboardHome() {
   return (
    <div>
       <h2>Welcome to Dasboard</h2>
      {/* If you have nested routes, keep Outlet, else remove it */}
      <Outlet />
    </div>
  );
}