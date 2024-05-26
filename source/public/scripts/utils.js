export function validateImportance(value) {
    const parsedValue = parseInt(value, 10);
    if (parsedValue < 1 || parsedValue > 5) {
        return { isValid: false, errorMessage: "Value must be less than or equal to 5." };
    }
    return { isValid: true, errorMessage: "" };
}


export function getRelativeDate(dateString) {
    if (!dateString) {
        return "Someday";
    }

    const inputDate = new Date(dateString);
    if (isNaN(inputDate.getTime())) {
        return "Someday";
    }

    const inputDateOnly = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const currentDateOnly = new Date();
    currentDateOnly.setHours(0, 0, 0, 0);

    const timeDiff = inputDateOnly - currentDateOnly;
    const daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (daysDiff === 0) {
        return "Today";
    } else if (daysDiff === 1) {
        return "Tomorrow";
    } else if (daysDiff === -1) {
        return "Yesterday";
    } else {
        return rtf.format(daysDiff, 'day');
    }
}