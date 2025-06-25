//require("dotenv").config({ path: "../.env" });
const nodemailer = require("nodemailer");
const path = require("path");
const { uploadToDropbox } = require("./dropboxUploader");

async function mailDatas(fileName) {
	const filePath = path.join(__dirname, "../", fileName);
	let dropboxLink;

	try {
		dropboxLink = await uploadToDropbox(filePath, `/${fileName}`);
		console.log(`Uploaded to DropBox: ${dropboxLink}`);
	} catch (err) {
		console.error("Error at uploadin to DropBox:", err);
		return;
	}

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
		html: `<p>Az adatokat letöltheted innen:<br><a href="${dropboxLink}">${dropboxLink}</a></p>`,
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
