const axios = require("axios");
const delay = require("../utils/delay");

async function deviceData(formData, devices, fromInput, toInput, url) {
	formData.set("action", "device_data");
	formData.set("from", fromInput);
	formData.set("to", toInput);
	formData.set("device", -1);

	const timeSeriesData = [];

	let loader = 0;
	process.stdout.write(`\r${Math.floor((loader / devices.length) * 100)}% `);

	for (const device of devices) {
		formData.set("device", device.id);

		let success = false;

		while (!success) {
			try {
				const res = await axios.post(url, formData.toString(), {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				});

				timeSeriesData.push(res.data);

				success = true;
			} catch (error) {
				console.log(error);
				console.log(`ERROR AT REQUESTIN DEVICE DATA ${device.id}`);
				console.log("RETRY...");
				await delay(5000);
			}
		}

		loader += 1;
		process.stdout.write(`\r${Math.floor((loader / devices.length) * 100)}%`);
		await delay(1000);
	}
	return timeSeriesData;
}

module.exports = deviceData;
