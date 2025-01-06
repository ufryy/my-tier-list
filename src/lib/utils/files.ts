import { dev } from '$app/environment';

export const ITEM_MAX_WIDTH: number = 256;
export const ITEM_MAX_HEIGHT: number = 256;

// Source: https://labs.madisoft.it/javascript-image-compression-and-resizing/
function scaleToFit(
	width: number,
	height: number,
	maxWidth: number,
	maxHeight: number
): [number, number] {
	// calculate the width and height, constraining the proportions
	if (width > height) {
		if (width > maxWidth) {
			height = Math.round((height * maxWidth) / width);
			width = maxWidth;
		}
	} else {
		if (height > maxHeight) {
			width = Math.round((width * maxHeight) / height);
			height = maxHeight;
		}
	}
	return [width, height];
}

// Inspired by: https://labs.madisoft.it/javascript-image-compression-and-resizing/
export async function compressImage(
	dataURL: string,
	maxWidth: number = ITEM_MAX_WIDTH,
	maxHeight: number = ITEM_MAX_HEIGHT,
	format: 'image/jpeg' | 'image/png' = 'image/jpeg',
	quality: number = 0.6
): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			try {
				const [newWidth, newHeight] = scaleToFit(img.width, img.height, maxWidth, maxHeight);
				const canvas = document.createElement('canvas');
				canvas.width = newWidth;
				canvas.height = newHeight;
				const ctx = canvas.getContext('2d');
				ctx!.drawImage(img, 0, 0, newWidth, newHeight);
				const newDataURL = canvas.toDataURL(format, quality);

				if (dev) {
					const encoder = new TextEncoder();
					console.debug(
						`Compressed image from ${readableBytes(encoder.encode(dataURL).length)} to ${readableBytes(
							encoder.encode(newDataURL).length
						)}`
					);
				}

				resolve(newDataURL);
			} catch (err) {
				console.error('Error compressing image', err);
				reject(err);
			}
		};
		img.onerror = () => reject(new Error('Failed to load image'));
		img.src = dataURL;
	});
}

// Source: https://labs.madisoft.it/javascript-image-compression-and-resizing/
export function readableBytes(bytes: number): string {
	const i = Math.floor(Math.log(bytes) / Math.log(1024)),
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

export function readFileAsDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export function saveJSONFile(jsonString: string, filename: string): void {
	const blob = new Blob([jsonString], {
		type: 'application/json'
	});

	const link = document.createElement('a');
	link.download = filename;
	link.href = URL.createObjectURL(blob);
	link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

	const evt = new MouseEvent('click', {
		view: window,
		bubbles: true,
		cancelable: true
	});

	link.dispatchEvent(evt);
	URL.revokeObjectURL(link.href);
	link.remove();
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
