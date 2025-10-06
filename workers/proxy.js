async function handleRequest(request, env) {
	const url = new URL(request.url);
	const p = url.pathname;
	const pathname = p.startsWith("/api") ? p.replace("/api", "") : p;

	const targetURL = `https://${env.API_HOST}${pathname}`;

	const headers = new Headers(request.headers);

	const targetRequest = new Request(targetURL, {
		method: request.method,
		headers: headers,
		body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
	});

	return fetch(targetRequest);
}

export default {
	async fetch(request, env) {
		return handleRequest(request, env);
	},
};
