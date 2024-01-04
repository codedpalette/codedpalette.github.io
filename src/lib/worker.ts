import { loadModule, type SizeParams, Sketch, type SketchModule, SketchRenderer } from 'sketches';
import { worker } from 'workerpool';

const renderer = new SketchRenderer<OffscreenCanvas>();

async function render(sketchModule: SketchModule, params: SizeParams) {
	const sketchFactory = await loadModule(sketchModule);
	const sketch = new Sketch(sketchFactory, renderer, params);
	sketch.render();
	// Note: a more logical solution would be to transfer canvas from the main thread to a worker and then render
	// directly onto it. However, it causes canvas to be cleared after some tab switching. I was unable to find a root cause
	// for this bug, but it's probably related to https://bugs.chromium.org/p/chromium/issues/detail?id=1202481.
	// One possible fix might be to transfer all canvases in one message, but in the current architecture it would be a
	// non-trivial task, since it would require spinning a load balancing worker, not to mention changes to a svelte components
	// hierarchy. In future, might be worth looking into other web worker libraries (https://github.com/josdejong/workerpool?tab=readme-ov-file#related-libraries)
	// or rolling my own thread pool implementation
	return createImageBitmap(renderer.canvas);
}

function onTerminate() {
	renderer.destroy();
}

worker({ render }, { onTerminate });
