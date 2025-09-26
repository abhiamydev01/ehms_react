import Swal from "sweetalert2";

// ✅ Confirmation popup
export const confirmAction = (title, text, confirmButtonText, confirmButtonColor, onConfirm) => {
    Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor,
        cancelButtonColor: "#3085d6",
        confirmButtonText,
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
};

// ✅ Success popup
export const showSuccess = (message) => {
    Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        timer: 1500,
        showConfirmButton: false,
    });
};

// ✅ Error popup
export const showError = (message) => {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: message || "Something went wrong. Please try again.",
    });
};
