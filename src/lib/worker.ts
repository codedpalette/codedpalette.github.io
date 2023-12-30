import { Sketch, loadModule, SketchRenderer, type SizeParams, type SketchModule } from 'sketches';
import workerpool from 'workerpool';

const renderer = new SketchRenderer();

async function render(sketchModule: SketchModule, canvas: OffscreenCanvas, params: SizeParams) {
	const sketchFactory = await loadModule(sketchModule);
	const sketch = new Sketch(sketchFactory, renderer, params);
	sketch.render(canvas);
}

function onTerminate() {
	renderer.destroy();
}

workerpool.worker({ render }, { onTerminate });
