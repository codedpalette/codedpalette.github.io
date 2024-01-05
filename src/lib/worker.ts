import { loadModule, type SizeParams, Sketch, type SketchModule, SketchRenderer } from 'sketches';
import { worker } from 'workerpool';

const renderer = new SketchRenderer<OffscreenCanvas>();

export type RenderResult = {
	blob: Blob;
	seed: number[];
};

async function render(sketchModule: SketchModule, params: SizeParams): Promise<RenderResult> {
	const sketchFactory = await loadModule(sketchModule);
	const sketch = new Sketch(sketchFactory, renderer, params);
	const blob = await sketch.export();
	const seed = sketch.seed;
	return { blob, seed };
}

function onTerminate() {
	renderer.destroy();
}

worker({ render }, { onTerminate });
