function mergeDatas(devices, devicesData) {
	return devices.map((device) => {
		const newPoints = device.points.map((point) => {
			const mergedValues = devicesData
				.filter((entry) => entry.hasOwnProperty(point.id))
				.map((entry) => ({
					value: entry[point.id],
					timestamp: entry.timestamp,
				}));

			return {
				...point,
				value: mergedValues,
			};
		});

		return {
			...device,
			points: newPoints,
		};
	});
}

module.exports = mergeDatas;
