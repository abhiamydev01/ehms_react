import { useState, useEffect } from "react";
import Loader from "../components/loader.jsx";
import CustomDataTable from "../components/CustomDataTable.jsx";
import ApiService from "../utils/ApiServices.js";

const DoctorPaymentTable = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPaymentDetails = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getDoctorPaymentDetails();
      setDoctorData(res.data);
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
      setDoctorData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  if (loading) return <Loader />;

  if (!doctorData)
    return <p className="text-center text-gray-500 mt-10">No data available</p>;

  // Doctor Summary Table
  const doctorColumns = [
    { name: "Doctor ID", selector: (row) => row.doctorId, sortable: true },
    { name: "Doctor Name", selector: (row) => row.doctorName, sortable: true },
    { name: "Appointment Fees", selector: (row) => `₹${row.appointment_fees}`, sortable: true },
    { name: "Total Till Now", selector: (row) => `₹${row.totalTillNow}`, sortable: true },
    {
      name: "Today",
      cell: (row) => (
        <div className="flex flex-col"> 
          <span>Total Payment: ₹{row.today.totalPayment}</span>
        </div>
      ),
    },
  ];

  // Date-wise Summary Table
  const datewiseColumns = [
    { name: "Date", selector: (row) => row.date, sortable: true },
    { name: "Total Payment", selector: (row) => `₹${row.totalPayment}`, sortable: true },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Doctor Summary */}
      <h2 className="text-lg font-semibold mb-2">Doctor Summary</h2>
      <CustomDataTable
        columns={doctorColumns}
        data={[doctorData]} // Wrap in array for table
        pagination={false}
      />

      {/* Date-wise Summary */}
      <h2 className="text-lg font-semibold mb-2 mt-6">Date-wise Summary</h2>
      <CustomDataTable
        columns={datewiseColumns}
        data={doctorData.datewiseSummary}
        pagination={false}
      />
    </div>
  );
};

export default DoctorPaymentTable;
