const readline = require("readline");

function question(text) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(text, (response) => {
			rl.close();
			resolve(response);
		});
	});
}

module.exports = question;
