require("dotenv").config();
const fs = require("fs");
const runtime = require("./requests/runtime");
const deviceDataSplits = require("./utils/deviceDataSplits");
const fullMerge = require("./utils/fullMerge");
const mailDatas = require("./utils/mailDatas");

async function main() {
	const ip = process.env.IP;
	const usernameInput = process.env.USERNAMEE;
	const passwordInput = process.env.PASSWORD;
	const fromInput = process.env.FROM;
	const toInput = process.env.TO;

	const url = `http://${ip}/api`;

	const formData = new URLSearchParams();
	formData.append("format", "json");
	formData.append("username", usernameInput);
	formData.append("password", passwordInput);

	const devices = await runtime(formData, url);
	const values = await deviceDataSplits(
		formData,
		devices,
		fromInput,
		toInput,
		url
	);

	const allMergedDatas = fullMerge(devices, values);

	const fileName = `from${fromInput}-to${toInput}-FULL.json`;

	fs.writeFileSync(fileName, JSON.stringify(allMergedDatas, null, 2));

	mailDatas(fileName);
}

main();
