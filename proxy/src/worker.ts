// Proxy domain.tld/api to api.domain.tld/internal
async function handleAPI(req: Request, env: Env) {
	const pathname = new URL(req.url).pathname.replace("/api", "");
	const url = `https://${env.API_HOST}${pathname}`;
	const headers = new Headers(req.headers);
	const request = new Request(url, {
		method: req.method,
		headers: headers,
		body: req.method !== "GET" && req.method !== "HEAD" ? req.body : null,
	});
	return fetch(request);
}

// Proxy domain.tld/__/auth to <project>.firebaseapp.com/__/auth
async function handleAuth(req: Request, env: Env) {
	if (req.method !== "GET" && req.method !== "POST") {
		return new Response("Method Not Allowed", { status: 405 });
	}
	const pathname = new URL(req.url).pathname;
	const url = `https://${env.FIREBASE_AUTH_DOMAIN}${pathname}`;
	const headers = new Headers(req.headers);
	const request = new Request(url, {
		method: req.method,
		headers: headers,
		body: req.method !== "GET" ? req.body : null,
	});
	return fetch(request);
}

async function handleRequest(req: Request, env: Env) {
	const url = new URL(req.url);
	const p = url.pathname;
	if (p.startsWith("/api")) {
		return handleAPI(req, env);
	}
	if (p.startsWith("/__/auth")) {
		return handleAuth(req, env);
	}
	return new Response("Not found", { status: 404 });
}

export default {
	async fetch(request, env): Promise<Response> {
		return handleRequest(request, env);
	},
} satisfies ExportedHandler<Env>;
