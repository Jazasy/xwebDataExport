const deviceData = require("../requests/deviceData");
const fs = require("fs");
const mergeDatas = require("./mergeDatas");
const mailDatas = require("./mailDatas");

async function deviceDataSplits(formData, devices, fromInput, toInput, url) {
	const TWO_WEEKS = 60 * /* 60 * 24 * */ 14;
	let currentFrom = fromInput;
	let allResults = [];

	while (currentFrom < toInput) {
		const currentTo = Math.min(currentFrom + TWO_WEEKS, toInput);

		const formDataCopy = new URLSearchParams(formData.toString());

		console.log(`Exporting from ${currentFrom} to ${currentTo}:`);

		const result = await deviceData(
			formDataCopy,
			devices,
			currentFrom,
			currentTo,
			url
		);

		if (result) {
			allResults.push(...result);

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
