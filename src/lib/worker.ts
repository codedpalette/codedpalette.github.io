import { loadModule, type SizeParams, Sketch, type SketchModule, SketchRenderer } from 'sketches';
import { worker } from 'workerpool';

const renderer = new SketchRenderer();

async function render(sketchModule: SketchModule, canvas: OffscreenCanvas, params: SizeParams) {
	const sketchFactory = await loadModule(sketchModule);
	const sketch = new Sketch(sketchFactory, renderer, params);
	sketch.render(canvas);
}

function onTerminate() {
	renderer.destroy();
}

worker({ render }, { onTerminate });
