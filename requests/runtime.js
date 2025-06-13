const fs = require("fs");
const axios = require("axios");
const decode = require("../utils/decode");

async function runtime(formData) {
	try {
		formData.set("action", "runtime");

		res = await axios.post(url, formData.toString(), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const devices = res.data.runtime.devices.map((device) => ({
			id: device.id,
			name: device.name,
			points: device.points,
		}));

		return decode(devices);
	} catch (error) {
		console.error("ERROR IN RUNTIME REQUEST");
		console.error(error);
	}
}

module.exports = runtime;
