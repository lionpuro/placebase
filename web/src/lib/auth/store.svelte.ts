import type { User } from "firebase/auth";

type Session = {
	user: User | null;
	isLoggedIn: boolean;
	isLoading: boolean;
};

const storageKey = "logged_in";

function defaultState(): Session {
	const val = localStorage.getItem(storageKey);
	const loggedIn = val !== null && JSON.parse(val) === true;
	return { user: null, isLoggedIn: loggedIn, isLoading: true };
}

class SessionStore {
	#session: Session = $state({ ...defaultState() });

	get user(): User | null {
		return this.#session.user;
	}

	get isLoggedIn(): boolean {
		return this.#session.isLoggedIn;
	}

	get isLoading(): boolean {
		return this.#session.isLoading;
	}

	update(user: User | null) {
		this.#session.user = user;
		const loggedin = user !== null;
		this.#session.isLoggedIn = loggedin;
		localStorage.setItem(storageKey, JSON.stringify(loggedin));
		this.#session.isLoading = false;
	}

	delete() {
		this.#session.user = null;
		this.#session.isLoggedIn = false;
		localStorage.setItem(storageKey, JSON.stringify(false));
	}
}

export const session = new SessionStore();
