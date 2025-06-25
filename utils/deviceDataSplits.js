const deviceData = require("../requests/deviceData");
const fs = require("fs");
const mergeDatas = require("./mergeDatas");
const mailDatas = require("./mailDatas");

async function deviceDataSplits(formData, devices, fromInput, toInput, url) {
	const splitTime = 60 * 60 * 24 * 3; //1 hét gyors és stabil (2 hét is jó, az egy hónap már néha hibát dob)
	let currentFrom = fromInput;
	let allResults = [];

	while (currentFrom < toInput) {
		const currentTo = Math.min(currentFrom + splitTime, toInput);

		const formDataCopy = new URLSearchParams(formData.toString());

		console.log(`\rExporting from ${currentFrom} to ${currentTo}:`);

		const result = await deviceData(
			formDataCopy,
			devices,
			currentFrom.toString(),
			currentTo.toString(),
			url
		);

		if (result) {
			mergedResult = mergeDatas(devices, result);

			const fileName = `from${currentFrom}-to${currentTo}-SPLIT.json`;

			fs.writeFileSync(fileName, JSON.stringify(mergedResult, null, 2));

			mailDatas(fileName);
		}

		currentFrom = currentTo;
	}

	return allResults;
}

module.exports = deviceDataSplits;


