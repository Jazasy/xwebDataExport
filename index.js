const fs = require("fs");
const runtime = require("./requests/runtime");
const deviceData = require("./requests/deviceData");
const mergeDatas = require("./utils/mergeDatas");

async function main() {
	const ip = "185.232.83.138:10070";
	const usernameInput = "Admin";
	const passwordInput = "MY2049";
	const fromInput = 1749618079;
	const toInput = 1749704479;

	const url = `http://${ip}/api`;

	const formData = new URLSearchParams();
	formData.append("format", "json");
	formData.append("username", usernameInput);
	formData.append("password", passwordInput);

	const devices = runtime(formData, url);
	//console.dir(devices, { depth: null, colors: true });
	const deviceDatas = deviceData(formData, devices, fromInput, toInput, url);
	/* const mergedDatas = mergeDatas(devices, deviceDatas);

	console.dir(mergedDatas, { depth: null, colors: true }); */

	//const decoded = decode(devices);

	//fs.writeFileSync("response.json", JSON.stringify(decoded, null, 2), "utf8");
	//console.log(JSON.stringify(decoded, null, 2));
	//console.dir(decoded, { depth: null, colors: true });
}

main();
