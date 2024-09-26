export function encodeHex(arrayBuffer: Uint8Array): string {
	let hexString = '';
	for (const byte of arrayBuffer) {
		hexString += byte.toString(16).padStart(2, '0');
	}
	return hexString;
}