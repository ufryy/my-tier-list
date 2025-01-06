export function readFileAsDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

/**
 * Tests the given URL to see if it is a valid image URL.
 *
 * **NOTE**: this function will return true even if there is a CORS issue with the image.
 *
 * @param url URL to use as image's source
 * @returns True if the image's load event is triggered, false if the error event is triggered
 */
export function testImageURL(url: string): Promise<boolean> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = url;
	});
}
