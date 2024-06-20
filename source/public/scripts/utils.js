export function getRelativeDate(dateString) {
    if (!dateString) {
        return "Someday";
    }

    const inputDate = new Date(dateString);
    if (Number.isNaN(inputDate.getTime())) {
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
    }
    if (daysDiff === 1) {
        return "Tomorrow";
    }
    if (daysDiff === -1) {
        return "Yesterday";
    }
    return rtf.format(daysDiff, 'day');
}

export function compareDueDates(a, b, asc) {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    const isDateAValid = !Number.isNaN(dateA.getTime());
    const isDateBValid = !Number.isNaN(dateB.getTime());

    if (!isDateAValid && !isDateBValid) return 0;
    if (!isDateAValid) return asc ? 1 : -1;
    if (!isDateBValid) return asc ? -1 : 1;

    return asc ? dateB - dateA : dateA - dateB;
}
