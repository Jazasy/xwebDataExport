//require("dotenv").config({ path: "../.env" });
const nodemailer = require("nodemailer");

function mailDatas(fileName) {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS,
		},
	});

	let mailOptions = {
		from: process.env.GMAIL_USER,
		to: process.env.GMAIL_ADDRESS,
		subject: "XWEB500 DATA EXPORT",
		text: "AUTOMATIC MESSAGE",
		attachments: [
			{
				filename: fileName,
				path: `./${fileName}`,
			},
		],
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.error(error);
		} else {
			console.log(`\rMESSAGE SENT: ` + info.response);
		}
	});
}

module.exports = mailDatas;
