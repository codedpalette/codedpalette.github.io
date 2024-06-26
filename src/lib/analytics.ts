type ErrorEventData = {
	message: string;
	stack?: string;
	name?: string;
	cause?: string;
};

export function trackError(err: unknown) {
	const errorData: ErrorEventData =
		err instanceof Error
			? {
					message: err.message,
					stack: err.stack,
					name: err.name,
					cause: `${err.cause}`
				}
			: { message: `${err}` };
	window.umami && umami.track('error_event', errorData);
}
