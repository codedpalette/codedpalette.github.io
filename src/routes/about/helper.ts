import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { whereAlpha2 } from 'iso-3166-1';
import md from 'markdown-it';
import moment from 'moment';

export function calcLocation(location: Required<ResumeSchema>['basics']['location']) {
	const array = [];
	if (!location) return null;
	location.city && array.push(location.city);
	location.region && array.push(location.region);
	if (location.countryCode) {
		const country = whereAlpha2(location.countryCode);
		array.push(country && array.length < 2 ? country.country : location.countryCode);
	}
	return array.length > 0 ? array.join(', ') : null;
}

export function mdToHtml(string?: string) {
	return string ? md().render(string) : '';
}

export function validArray<T>(array?: T[]): array is T[] {
	return array !== undefined && array.length > 0;
}

export function calcDateRange(start: moment.MomentInput, end: moment.MomentInput, short: boolean) {
	const array = [];

	const startDate = calcDate(start, short);
	const endDate = calcDate(end, short);

	if (startDate && endDate) {
		array.push(startDate, endDate);
	} else if (startDate) {
		array.push(startDate, 'Present');
	} else if (endDate) {
		array.push(endDate);
	} else {
		return '';
	}

	return array.join(' - ');
}

function calcDate(date: moment.MomentInput, short: boolean) {
	return date ? beautifyDate(date, short) : null;
}

function beautifyDate(date: moment.MomentInput, short: boolean) {
	return moment(date, 'YYYY-MM-DD').format(short ? 'MM/YY' : 'MMM YYYY');
}

export function beautifyArray(separator: string, array: Array<unknown>) {
	return array.filter((x) => x).join(separator);
}

export function beautifyLink(string: string) {
	const url = string.trim().replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
	return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function arrayToPhrase(array?: string[]) {
	let str = '';
	const a = array || [];

	if (a.length === 1) {
		str = a[0];
	} else if (a.length === 2) {
		str = a.join(' and ');
	} else if (a.length > 2) {
		str = a.slice(0, -1).join(', ') + ' and ' + a.slice(-1);
	}

	return str.charAt(0).toUpperCase() + str.slice(1);
}
