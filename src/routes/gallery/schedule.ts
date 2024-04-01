export function skipFrames(callback: () => void, frames = 1) {
	setTimeout(callback, 17 * frames);
}
