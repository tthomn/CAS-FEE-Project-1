export function validateImportance(value) {
    const parsedValue = parseInt(value, 10);
    if (parsedValue < 1 || parsedValue > 5) {
        return { isValid: false, errorMessage: "Value must be between 1 and 5." };
    }
    return { isValid: true, errorMessage: "" };
}