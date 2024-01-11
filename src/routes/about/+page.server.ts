import { render } from 'jsonresume-theme-actual';

import resume from './resume.json';

export async function load() {
	return {
		template: render(resume) as string
	};
}
