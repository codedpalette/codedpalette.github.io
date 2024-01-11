declare module 'jsonresume-theme-actual' {
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	export function render(resume: ResumeSchema): string;
}
