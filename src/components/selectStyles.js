export const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "white",
        border: "1px solid #d1d5db",
        borderRadius: "2px",
        minHeight: "30px",
        height: "30px",
        boxShadow: state.isFocused
            ? "0 0 0 1px #bfdbfe"
            : "0 1px 2px rgba(0,0,0,0.05)",
        "&:hover": {
            borderColor: "#9ca3af",
        },
    }),
    valueContainer: (base) => ({
        ...base,
        height: "32px",
        padding: "0 6px",
        fontSize: "14px",
    }),
    input: (base) => ({
        ...base,
        margin: "0",
        padding: "0",
    }),
    indicatorsContainer: (base) => ({
        ...base,
        height: "32px",
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
    menu: (base) => ({
        ...base,
        fontSize: "14px",
        textAlign: "left",
        border: "1px solid #d1d5db",
        borderRadius: "2px",
        marginTop: "2px",
    }),
    option: (base, state) => ({
        ...base,
        padding: "4px 8px",
        fontSize: "14px",
        lineHeight: "1.2",
        minHeight: "28px",
        color: "#374151",
        borderBottom: "1px solid #d1d5db",
        backgroundColor: state.isFocused ? "#f3f4f6" : "white",
        cursor: "pointer",
        ":last-of-type": {
            borderBottom: "none",
        },
    }),
    placeholder: (base) => ({
        ...base,
        color: "#d1d5db",
        textAlign: "left",
        fontSize: "14px",
    }),
    menuList: (base) => ({
        ...base,
        padding: "4px 0",
    }),
    noOptionsMessage: (base) => ({
        ...base,
        padding: "4px 8px",
        fontSize: "13px",
        minHeight: "28px",
        lineHeight: "1.2",
        color: "#9ca3af",
        textAlign: "left",
    }),
};
