
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
export const maxEmailLength = 100;
export const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

/**
 * Validate email format and length
 * @param {string} email
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateEmail(email) {
    const trimmed = email.trim();

    if (!trimmed) {
        return { isValid: false, message: "Email is required." };
    }

    if (trimmed.length > maxEmailLength) {
        return {
            isValid: false,
            message: `Email cannot exceed ${maxEmailLength} characters.`,
        };
    }

    // Block multiple @ signs
    if ((trimmed.match(/@/g) || []).length > 1) {
        return { isValid: false, message: "Email cannot contain multiple '@' symbols." };
    }

    // Check regex match
    if (!emailRegex.test(trimmed)) {
        return { isValid: false, message: "Please enter a valid email address." };
    }

    return { isValid: true, message: "" };
}

//// Validate url format 

export function validateURL(url) {
    const trimmed = url.trim();
    if (!trimmed) return { isValid: false, message: "URL is required." };

    if (!urlRegex.test(trimmed)) {
        return { isValid: false, message: "Please enter a valid URL." };
    }

    return { isValid: true, message: "" };
}


//// Validation for number only
export function enableNumberOnlyValidation() {
    document.addEventListener("input", function (e) {
        if (e.target.classList.contains("number-only")) {
            e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits allowed
        }
    });

    // optional: prevent pasting non-numbers
    document.addEventListener("paste", function (e) {
        if (e.target.classList.contains("number-only")) {
            const paste = (e.clipboardData || window.clipboardData).getData("text");
            if (/[^0-9]/.test(paste)) {
                e.preventDefault();
            }
        }
    });
}
