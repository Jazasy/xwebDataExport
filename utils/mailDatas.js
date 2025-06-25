//require("dotenv").config({ path: "../.env" });
const nodemailer = require("nodemailer");
const path = require("path");
const archiver = require("archiver");
const fs = require("fs");
const fsp = require("fs/promises");  

async function zipFile(inputFile, outputZipPath) {
	return new Promise((resolve, reject) => {
		const output = fs.createWriteStream(outputZipPath);
		const archive = archiver("zip", { zlib: { level: 9 } });

		output.on("close", () => {
			console.log(`Zip done: ${archive.pointer()} byte -> ${outputZipPath}`);
			resolve();
		});

		archive.on("error", reject);

		archive.pipe(output);
		archive.file(inputFile, { name: path.basename(inputFile) });
		archive.finalize();
	});
}

async function mailDatas(fileName) {
	const zipName = `${fileName}.zip`;
	await zipFile(`./${fileName}`, zipName);

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
				filename: path.basename(zipName),
				path: path.resolve(zipName),
				contentType: "application/zip",
			},
		],
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log(`MESSAGE SENT: ${info.response}`);
	
		// Mindkettő törlése:
		await fsp.unlink(zipName);
		console.log(`zip deleted: ${zipName}`);
	
		await fsp.unlink(`../${fileName}`);
		console.log(`original file deleted: ${fileName}`);
	  } catch (error) {
		console.error("Error sending mail or deleting files:", error);
	  }
}

mailDatas("test.json");

module.exports = mailDatas;
