const fs = require('fs').promises;
const cnv = require('canvas');

module.exports.getImageBlob = async function getImageBlob(inputFile) {
  let imageBlob = null;
  if (inputFile) {
    const MAX_WIDTH = 300;
    const MAX_HEIGHT = 300;

    let tempFilename = './uploads/' + this.getTempFilename();
    if (inputFile.mv) {
      await inputFile.mv(tempFilename);
    } else {
      await fs.copyFile(inputFile.name, tempFilename);
    }
    let image = await cnv.loadImage(tempFilename);
    var width = image.width;
    var height = image.height;
    var posX = 0;
    var posY = 0;

    // Resizing logic
    if (width > height) {
      height = height * (MAX_WIDTH / width);
      width = MAX_WIDTH;
      posY = Math.abs(width - height) / 2;
    } else if (width < height) {
      width = width * (MAX_HEIGHT / height);
      height = MAX_HEIGHT;
      posX = Math.abs(width - height) / 2;
    }
    let canvas = cnv.createCanvas(MAX_WIDTH, MAX_HEIGHT);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, posX, posY, width, height);
    imageBlob = canvas.toDataURL(image.type);
    // Remove image file from uploads folder
    await fs.rm(tempFilename);
  }
  return imageBlob;
}

// the following code are taken from reference: https://stackoverflow.com/a/15365656
module.exports.getTempFilename = function getTempFilename() {
  const crypto = require('crypto');
  return 'tmp' + crypto.randomBytes(4).readUInt32LE(0) + 'image' + '.tmp';
}
