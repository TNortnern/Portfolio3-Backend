const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const imgur = require("imgur-module");
const unique = new Date().getTime().toString();
// intilize client id
imgur.setClientId("546c25a59c58ad7");

const fileURL = (filename) => {
  return process.env.PRODUCTION_APP_URL + "/images/" + unique + filename;
};

exports.fileUpload = async (file) => {
  const imageURL = await upload(file);
  // uploading image file
  let imgurURL = "";
  let error = false;
  await imgur
    .uploadImgur(imageURL)
    .then(({ success, url }) => {
      if (success) imgurURL = url;
      else {
        error = true;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return imgurURL;
};
/** @param {array} images
 *  @returns {array} returns array of links
 *  @description Takes multiple images, uploads them to imgur then returns the links as an array
 * 
 */
exports.multiFileUpload = async (images) => {
  let imageNames = [];
  let error = false;
  for await (const image of images) {
    const imageURL = await upload(image);
    await imgur
      .uploadImgur(imageURL)
      .then(({ success, url, message }) => {
        if (success) imageNames = [...imageNames, url];
        else {
          console.log(success);
          console.log(message);
          error = true;
        }
        console.log(url);
      })
      .catch((err) => {
        console.log(err);
      });
    if (error) {
      throw new Error("Error Uploading");
    }
  }
  if (error) imageNames = [];
  // Image Parse End
  return imageNames;
};

const upload = async (file) => {
  const { filename, mimetype, createReadStream } = await file;
  let getFileURL = "";
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
      getFileURL = fileURL(filename);
    })
    .catch((err) => {
      throw new Error("Error uploading image");
    });

  return getFileURL;
};
/**
 * @param {object} user
 * @param {string} expiresIn
 * @returns {string}
 * @description Takes a user and assigns them a token
 */
exports.generateAccessToken = (user, expiresIn) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_AUTH_KEY,
    { expiresIn }
  );
  return token
};
