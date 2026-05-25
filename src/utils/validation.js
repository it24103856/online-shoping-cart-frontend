export function normalizePhone(phone) {
    if (!phone) return "";
    return String(phone).replace(/\D/g, "");
}

export function isValidPhone(phone) {
    const normalized = normalizePhone(phone);
    return normalized.length >= 10 && normalized.length <= 15;
}
