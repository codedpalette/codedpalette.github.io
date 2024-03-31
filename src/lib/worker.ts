import { initRenderer, loadModule, type SizeParams, type SketchModule, type SketchRenderer } from 'sketches';
import { worker } from 'workerpool';

let renderer: SketchRenderer<OffscreenCanvas>;

export type RenderResult = {
	blob: Blob;
	seed: number[];
};

async function render(sketchModule: SketchModule, params: SizeParams, format?: string): Promise<RenderResult> {
	renderer = renderer || (await initRenderer());
	const sketchConstructor = await loadModule(sketchModule);
	const sketch = sketchConstructor(renderer, params);
	const blob = await sketch.export({ format });
	const seed = sketch.seed;
	return { blob, seed };
}

function onTerminate() {
	renderer.destroy();
}

worker({ render }, { onTerminate });
