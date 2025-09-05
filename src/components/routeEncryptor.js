import CryptoJS from "crypto-js";

const SECRET_KEY = "ehms_react_secret_amysoftech#2025"; // Change this and keep it private

export function encryptRoute(route) {
    return CryptoJS.AES.encrypt(route, SECRET_KEY).toString()
        .replace(/\//g, "_"); // Make URL-safe
}

export function decryptRoute(encrypted) {
    try {
        const bytes = CryptoJS.AES.decrypt(encrypted.replace(/_/g, "/"), SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
        return null;
    }
}
