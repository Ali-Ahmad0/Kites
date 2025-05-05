import { writable } from "svelte/store";

export const is_dark_mode = writable(true);

export function toggle_theme(): void {
    is_dark_mode.update((value) => {
        if (value) {
            document.documentElement.classList.add("light");
        } else {
            document.documentElement.classList.remove("light");
        }
        return !value;
    });
}
