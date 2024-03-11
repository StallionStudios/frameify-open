import puppeteer from "puppeteer";
import { KnownDevices } from "puppeteer";

import createMockup from "./js/createMockup.js";
import formatUrl from "./js/formatUrl.js";
import formatDate from "./js/formatDate.js";
import { overlayDeviceFrame, overlayMacFrame } from "./js/overlayFrame.js";

const iPhone = KnownDevices["iPhone X"];
const iPad = KnownDevices["iPad"];

const args = process.argv.slice(2);
const url = args[0];

const output = {};

async function screenshot(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const formattedDate = formatDate(new Date());
	const formattedUrl = formatUrl(url);

	// Paths for device frames
	const iPhoneFrame = "./frames/iphone-frame.png";
	const iPadFrame = "./frames/ipad-frame.png";
	const iMacFrame = "./frames/imac-frame.png";

	// iMac
	console.log(" ");
	console.log("emulating iMac...");
	await page.setViewport({ width: 1920, height: 1080 });

	console.log("opening webpage...");
	await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

	console.log("taking screenshot...");
	const iMacScreenshotPath = `screenshots/${formattedUrl}_${formattedDate}_imac.png`;
	await page.screenshot({ path: iMacScreenshotPath });
	await overlayMacFrame(iMacScreenshotPath, iMacFrame, `device-screenshots/${formattedUrl}_${formattedDate}_imac.png`, 2072, 1641, 207);

	output.imac = `device-screenshots/${formattedUrl}_${formattedDate}_imac.png`;

	// iPhone
	console.log("emulating iPhone...");
	await page.emulate(iPhone);

	console.log("opening webpage...");
	await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

	console.log("taking screenshot...");
	const iPhoneScreenshotPath = `screenshots/${formattedUrl}_${formattedDate}_iphone.png`;
	await page.screenshot({ path: iPhoneScreenshotPath });
	await overlayDeviceFrame(iPhoneScreenshotPath, iPhoneFrame, `device-screenshots/${formattedUrl}_${formattedDate}_iphone.png`, 1296, 2591);

	output.iphone = `device-screenshots/${formattedUrl}_${formattedDate}_iphone.png`;

	// iPad
	console.log(" ");
	console.log("emulating iPad...");
	await page.emulate(iPad);

	console.log("opening webpage...");
	await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

	console.log("taking screenshot...");
	const iPadScreenshotPath = `screenshots/${formattedUrl}_${formattedDate}_ipad.png`;
	await page.screenshot({ path: iPadScreenshotPath });
	await overlayDeviceFrame(iPadScreenshotPath, iPadFrame, `device-screenshots/${formattedUrl}_${formattedDate}_ipad.png`, 1750, 2504);

	output.ipad = `device-screenshots/${formattedUrl}_${formattedDate}_ipad.png`;

	await browser.close();

	const images = [output.iphone, output.ipad, output.imac];
	const outputPath = `mockups/${formattedUrl}_${formattedDate}.png`;

	(async () => {
		try {
			await createMockup(images, outputPath);
		} catch (error) {
			console.error("Error creating mockup:", error);
		}
	})();
}

screenshot(url);
