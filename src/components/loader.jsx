// src/components/Loader.jsx
const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">
  <div className="relative w-10 h-10">
    <div className="absolute w-full h-full border-4 border-blue-300 rounded-full animate-spin border-t-transparent"></div>
    <div className="absolute w-6 h-6 top-2 left-2 border-4 border-blue-200 rounded-full animate-spin border-b-transparent"></div>
  </div>
  {/* <span className="ml-3 text-blue-600 font-medium">Loading...</span> */}
</div>

  );
};

export default Loader;
