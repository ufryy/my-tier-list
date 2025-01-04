import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Source: https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
export function isValidUrl(urlString: string): boolean {
	const urlPattern = new RegExp(
		'^(https?:\\/\\/)?' + // validate protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	); // validate fragment locator
	return !!urlPattern.test(urlString);
}

export function readFileAsDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
