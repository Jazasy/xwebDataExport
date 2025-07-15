const runtime = require("./requests/runtime");
const deviceDataSplits = require("./utils/deviceDataSplits");
const question = require("./utils/question");

async function main() {
	const ip = await question("Enter the IP address of XWEB: \n");
	const usernameInput = await question("Enter your username: \n");
	const passwordInput = await question("Enter your password: \n");
	const fromInput = await question(
		"Enter the beggining of the time interval (use UNIX timestamp format with seconds): \n"
	);
	const toInput = await question(
		"Enter the end of the time interval (use UNIX timestamp format with seconds): \n"
	);
	const emailAddress = null;

	const url = `http://${ip}/api`;

	const formData = new URLSearchParams();
	formData.append("format", "json");
	formData.append("username", usernameInput);
	formData.append("password", passwordInput);

	const devices = await runtime(formData, url);
	const values =
		devices &&
		(await deviceDataSplits(
			formData,
			devices,
			parseInt(fromInput, 10),
			parseInt(toInput, 10),
			url,
			emailAddress
		));

	values && console.log("you can find the file(s) in the program's directory");
}

main();
