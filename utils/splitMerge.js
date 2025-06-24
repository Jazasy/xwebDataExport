const fs = require("fs");

function mergeDatass(devices, deviceData) {
	return devices.map((device, index) => {
		const timeseries = deviceData[index] || [];

		const updatedPoints = device.points.map((point) => {
			const idStr = point.id.toString();
			const valueHistory = timeseries
				.map((entry) => {
					if (!entry || typeof entry !== "object") return null;
					const value = entry[idStr];
					const timestamp = entry.timestamp;
					if (value === undefined || timestamp === undefined) return null;
					return { value, timestamp };
				})
				.filter(
					(entry) => entry && typeof entry === "object" && "timestamp" in entry
				);

			return {
				...point,
				value: valueHistory,
			};
		});

		return {
			...device,
			points: updatedPoints,
		};
	});
}

const devices = JSON.parse(fs.readFileSync("../devices.json", "utf8"));
const deviceData = JSON.parse(
	fs.readFileSync("../testDeviceDatas.json", "utf8")
);

const merdgedDatas = mergeDatass(devices, deviceData);

fs.writeFileSync("testMergedDatas.json", JSON.stringify(merdgedDatas, null, 2));
