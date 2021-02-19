export const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
export const addDays = (dateIn, days) => {
    return new Date(dateIn.getFullYear(), dateIn.getMonth(), dateIn.getDate() + days);
};
