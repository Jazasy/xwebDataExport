const axios = require("axios");

async function deviceData(formData, devices, fromInput, toInput, url) {
	try {
		formData.set("action", "device_data");
		formData.append("from", fromInput);
		formData.append("to", toInput);
		formData.append("device", -1);

		const timeSeriesData = [];

		let loader = 0;
		process.stdout.write(`\r${Math.floor((loader / devices.length) * 100)}%`);

		for (const device of devices) {
			formData.set("device", device.id);

			const res = await axios.post(url, formData.toString(), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			timeSeriesData.push(res.data);

			loader += 1;
			process.stdout.write(`\r${Math.floor((loader / devices.length) * 100)}%`);
		}
		return timeSeriesData;
	} catch (error) {
		console.error("ERROR IN DEVICE_DATA REQUEST");
		console.error(error);
	}
}

module.exports = deviceData;
