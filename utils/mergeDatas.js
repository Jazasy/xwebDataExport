function mergeDatas(devices, deviceData) {
	return devices.map((device, index) => {
		const timeseries = deviceData[index]?.data || [];

		const updatedPoints = device.points.map((point) => {
			const idStr = point.id.toString();
			const valueHistory = timeseries
				.filter((entry) => idStr in entry)
				.map((entry) => ({
					value: entry[idStr],
					timestamp: entry.timestamp,
				}));

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

module.exports = mergeDatas;
