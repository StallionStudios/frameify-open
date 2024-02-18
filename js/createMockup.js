import sharp from "sharp";

async function createMockup(devices, outputPath) {
	const iphone = sharp(devices[0]);
	const ipad = sharp(devices[1]);
	const imac = sharp(devices[2]);

	// Get metadata for resizing
	const iphoneMetaData = await iphone.metadata();
	const ipadMetaData = await ipad.metadata();
	const imacMetaData = await imac.metadata();

	// Resize the iPhone and iPad images based on their pixel density
	const iphoneBuffer = await iphone
		.resize({ width: Math.round(iphoneMetaData.width / 3.5) })
		.png()
		.toBuffer();
	const ipadBuffer = await ipad
		.resize({ width: Math.round(ipadMetaData.width / 2) })
		.png()
		.toBuffer();

	const imacOffset = Math.round(ipadMetaData.width / 3);
	const iphoneOffset = (await sharp(ipadBuffer).metadata()).width - (await sharp(iphoneBuffer).metadata()).width / 2;

	// Create a transparent image that will serve as the background for the mockup
	const transparentWidth = imacMetaData.width + imacOffset;
	const transparentHeight = imacMetaData.height;
	const transparentImg = await sharp({
		create: {
			width: transparentWidth,
			height: transparentHeight,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	}).png();

	// Composite the iMac, iPad, and iPhone images onto the transparent background
	const compositeImage = await transparentImg
		.composite([
			{ input: await imac.toBuffer(), left: imacOffset, top: 0 },
			{ input: ipadBuffer, left: 0, top: transparentHeight - (await sharp(ipadBuffer).metadata()).height },
			{ input: iphoneBuffer, left: iphoneOffset, top: transparentHeight - (await sharp(iphoneBuffer).metadata()).height },
		])
		.png()
		.toFile(outputPath);

	console.log("Mockup created successfully:", outputPath);
}

export default createMockup;
