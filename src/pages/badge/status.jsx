const StatusBadge = ({ status }) => {
  const colors = {
    // Active: "bg-green-200 text-green-700 rounded-sm",
    Pending: "bg-yellow-100 text-yellow-700 rounded-sm",
    Inactive: "bg-red-100 text-red-700 rounded-sm",
    Failed: "bg-red-200 text-red-800",
    Active: "border border-green-600 text-green-600 rounded-sm",
  
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;