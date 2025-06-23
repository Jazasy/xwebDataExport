const deviceData = require("../requests/deviceData");
const fs = require("fs");
const mergeDatas = require("./mergeDatas");
const mailDatas = require("./mailDatas");

async function deviceDataSplits(formData, devices, fromInput, toInput, url) {
	const splitTime = 60 * 60 * 24 * 7;
	let currentFrom = fromInput;
	let allResults = [];

	while (currentFrom < toInput) {
		const currentTo = Math.min(currentFrom + splitTime, toInput);

		const formDataCopy = new URLSearchParams(formData.toString());

		console.log(`Exporting from ${currentFrom} to ${currentTo}:`);

		const result = await deviceData(
			formDataCopy,
			devices,
			currentFrom.toString(),
			currentTo.toString(),
			url
		);

		if (result) {
			allResults.push(result); //ide nem jó a spreads

			mergedResult = mergeDatas(devices, allResults);

			const fileName = `from${fromInput}-to${currentTo}-SPLIT.json`;

			fs.writeFileSync(fileName, JSON.stringify(mergedResult, null, 2));

			mailDatas(fileName);
		}

		currentFrom = currentTo;
	}

	return allResults;
}

module.exports = deviceDataSplits;
