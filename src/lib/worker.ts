import { loadModule, type SizeParams, Sketch, type SketchModule, SketchRenderer } from 'sketches';
import { worker } from 'workerpool';

const renderer = new SketchRenderer<OffscreenCanvas>();

async function render(sketchModule: SketchModule, params: SizeParams) {
	const sketchFactory = await loadModule(sketchModule);
	const sketch = new Sketch(sketchFactory, renderer, params);
	sketch.render();
	return createImageBitmap(renderer.canvas);
}

function onTerminate() {
	renderer.destroy();
}

worker({ render }, { onTerminate });
