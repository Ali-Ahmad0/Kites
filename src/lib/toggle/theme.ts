export let is_dark_mode : boolean = true;

// Switch between light and dark mode
export function toggle_theme() : void {
    // Change theme
    if (is_dark_mode) {
        document.documentElement.classList.add("light");
    } else {
        document.documentElement.classList.remove("light");
    }

    // Update theme
    is_dark_mode = !is_dark_mode;
}