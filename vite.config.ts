import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import type { TemplateType } from 'rollup-plugin-visualizer/dist/plugin/template-types';
import { defineConfig } from 'vite';

const visualizerFileName = 'stats.html';

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			sveltekit(),
			process.env.CHART_TEMPLATE !== undefined
				? visualizer({
						emitFile: true,
						filename: visualizerFileName,
						template: (process.env.CHART_TEMPLATE as TemplateType) || undefined
					})
				: undefined
		],
		preview: {
			open: process.env.CHART_TEMPLATE !== undefined ? `/${visualizerFileName}` : undefined
		},
		esbuild: {
			drop: mode === 'production' ? ['console'] : []
		},
		build: {
			rollupOptions: {
				onwarn: (warning, defaultHandler) => {
					if (warning.code == 'INVALID_ANNOTATION' && warning.id?.includes('simplex-noise')) return;
					defaultHandler(warning);
				}
			},
			commonjsOptions: {
				// ignore workerpool's node-only dependencies
				ignore: ['os', 'child_process', 'worker_threads']
			}
		},
		worker: {
			format: 'es'
		}
	};
});
