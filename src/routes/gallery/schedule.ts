export function nextFrame(callback: () => void) {
	// 20 ms should be enough
	setTimeout(callback, 20);
}
