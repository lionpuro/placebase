import type { User } from "firebase/auth";

type State = {
	user: User | null;
	isLoggedIn: boolean;
	isLoading: boolean;
};

const storageKey = "logged_in";

function defaultState(): State {
	const val = localStorage.getItem(storageKey);
	const loggedIn = val !== null && JSON.parse(val) === true;
	return { user: null, isLoggedIn: loggedIn, isLoading: true };
}

class AuthStore {
	#state: State = $state({ ...defaultState() });

	get user(): User | null {
		return this.#state.user;
	}

	set user(user: User | null) {
		this.#state.user = user;
		this.#state.isLoggedIn = user !== null;
		localStorage.setItem(storageKey, JSON.stringify(user !== null));
	}

	get isLoggedIn(): boolean {
		return this.#state.isLoggedIn;
	}

	get isLoading(): boolean {
		return this.#state.isLoading;
	}

	set isLoading(v: boolean) {
		this.#state.isLoading = v;
	}

	reset() {
		this.#state.user = null;
		this.#state.isLoggedIn = false;
		localStorage.setItem(storageKey, JSON.stringify(false));
	}
}

export const authStore = new AuthStore();
