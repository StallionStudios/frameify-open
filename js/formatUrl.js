export default function formatUrl(url) {
	let strippedUrl = url.split("://")[1];
	return strippedUrl.replace(/\//g, "_").replace(/\./g, "_");
}
