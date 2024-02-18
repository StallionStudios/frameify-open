import sharp from "sharp";
export async function overlayDeviceFrame(screenshotPath, framePath, outputPath, frameWidth, frameHeight) {
	try {
		const transparentImg = await sharp({
			create: {
				width: frameWidth,
				height: frameHeight,
				channels: 4,
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			},
		})
			.png()
			.toBuffer();

		await sharp(transparentImg)
			.composite([
				{
					input: screenshotPath,
					gravity: "centre",
				},
				{
					input: framePath,
					gravity: "centre",
				},
			])
			.toFile(outputPath);
	} catch (error) {
		console.error(`Error adding frame: ${error}`);
	}
}

export async function overlayMacFrame(screenshotPath, framePath, outputPath, frameWidth, frameHeight, offsetY) {
	try {
		const transparentImg = await sharp({
			create: {
				width: frameWidth,
				height: frameHeight,
				channels: 4,
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			},
		})
			.png()
			.toBuffer();

		await sharp(transparentImg)
			.composite([
				{
					input: screenshotPath,
					left: 80,
					top: 75,
				},
				{
					input: framePath,
					gravity: "centre",
				},
			])
			.toFile(outputPath);
	} catch (error) {
		console.error(`Error adding frame: ${error}`);
	}
}
