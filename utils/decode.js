function decode(obj) {
	if (typeof obj === "string") {
		try {
			return decodeURIComponent(obj);
		} catch {
			return obj;
		}
	} else if (Array.isArray(obj)) {
		return obj.map(decode);
	} else if (obj && typeof obj === "object") {
		const result = {};
		for (const [key, value] of Object.entries(obj)) {
			result[key] = decode(value);
		}
		return result;
	}
	return obj;
}

module.exports = decode;
