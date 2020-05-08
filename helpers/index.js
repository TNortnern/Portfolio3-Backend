const fs = require('fs')
const path = require("path");
const imgur = require("imgur-module");

exports.fileUpload = async (file) => {
	let imageURL = "";
	let unique = new Date().getTime().toString();
	const {
		filename,
		mimetype,
		createReadStream
	} = await file;

	// Promisify the stream and store the file, then…
	await new Promise((res) =>
			createReadStream()
			.pipe(
				fs.createWriteStream(
					path.join(__dirname, "../public/images/", unique + filename)
				)
			)
			.on("close", res)
		)
		.then(() => {
			imageURL =
				process.env.PRODUCTION_APP_URL + "/images/" + unique + filename;
		})
		.catch((err) => {
			throw new Error("Error uploading image");
		});
	// Image Parse End

	// intilize client id
	imgur.setClientId("546c25a59c58ad7");

	// uploading image file
	let imgurURL = "";
	let error = false
	await imgur
		.uploadImgur(imageURL)
		.then(({
			success,
			url
		}) => {
			// imgurURL = result.url;
			if (success) imgurURL = url
			else {
				error = true
			}
		})
		.catch((err) => {
			console.log(err);
        });
        return imgurURL
}

