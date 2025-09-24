export type ClickEvent<T extends HTMLElement> = MouseEvent & {
	currentTarget: EventTarget & T;
};
