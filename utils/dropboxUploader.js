const fs = require("fs");
const { Dropbox } = require("dropbox");
const fetch = require("node-fetch"); // Szükséges a Dropbox SDK-hoz Node-ban

const ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

const dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch: fetch });

async function uploadToDropbox(localFilePath, dropboxFilePath) {
	const fileContents = fs.readFileSync(localFilePath);

	try {
		// Feltöltés
		await dbx.filesUpload({
			path: dropboxFilePath,
			contents: fileContents,
			mode: "overwrite",
		});

		// Megosztási link kérés
		let sharedLinkMetadata;
		try {
			sharedLinkMetadata = await dbx.sharingCreateSharedLinkWithSettings({
				path: dropboxFilePath,
			});
		} catch (error) {
			// Ha már van megosztott link, akkor kapjuk meg azt
			if (
				error.error &&
				error.error.shared_link_already_exists &&
				error.error.shared_link_already_exists.metadata
			) {
				sharedLinkMetadata = {
					url: error.error.shared_link_already_exists.metadata.url,
				};
			} else {
				throw error;
			}
		}

		// A linket alakítsd át így, hogy közvetlen letöltés legyen (opcionális)
		const url = sharedLinkMetadata.url.replace("?dl=0", "?dl=1");
		return url;
	} catch (err) {
		console.error("Dropbox feltöltési hiba:", err);
		throw err;
	}
}

module.exports = { uploadToDropbox };
