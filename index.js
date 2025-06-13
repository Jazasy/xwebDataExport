const fs = require("fs");
const runtime = require("./requests/runtime");
const deviceData = require("./requests/deviceData");
const mergeDatas = require("./utils/mergeDatas");
const exportToXlsx = require("./utils/exportToXlsx");

async function main() {
	const ip = "185.232.83.138:10070";
	const usernameInput = "Admin";
	const passwordInput = "MY2049";
	const fromInput = 1749787989;
	const toInput = 1749791589;

	const url = `http://${ip}/api`;

	const formData = new URLSearchParams();
	formData.append("format", "json");
	formData.append("username", usernameInput);
	formData.append("password", passwordInput);

	/* const devices = await runtime(formData, url);
	const deviceDatas = await deviceData(
		formData,
		devices,
		fromInput,
		toInput,
		url
	); */

	const savedRuntime = JSON.parse(fs.readFileSync("response.json", "utf8"));
	const savedDiveces = savedRuntime.map((device) => ({
		id: device.id,
		name: device.name,
		points: device.points,
	}));

	const savedDevicesData = JSON.parse(
		fs.readFileSync("deviceDatas.json", "utf8")
	);

	const mergedDatas = mergeDatas(savedDiveces, savedDevicesData);

	exportToXlsx(mergedDatas); // létrehozza a `devices_export.xlsx` fájlt

	//fs.writeFileSync("mergedDatas.json", JSON.stringify(mergedDatas, null, 2));

	//fs.writeFileSync("deviceDatas.json", JSON.stringify(deviceDatas, null, 2));
	/* const mergedDatas = mergeDatas(devices, deviceDatas);

	console.dir(mergedDatas, { depth: null, colors: true }); */

	//const decoded = decode(devices);

	//fs.writeFileSync("response.json", JSON.stringify(decoded, null, 2), "utf8");
	//console.log(JSON.stringify(decoded, null, 2));
	//console.dir(decoded, { depth: null, colors: true });
}

main();
