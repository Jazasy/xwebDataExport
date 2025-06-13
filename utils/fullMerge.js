function fullMerge(devices, allDeviceData) {
	const mergedDeviceData = devices.map(() => ({ data: [] }));

	allDeviceData.forEach((deviceDataChunk) => {
		deviceDataChunk.forEach((deviceData, index) => {
			if (deviceData?.data?.length) {
				mergedDeviceData[index].data.push(...deviceData.data);
			}
		});
	});

	return mergeDatas(devices, mergedDeviceData);
}

module.exports = fullMerge;
