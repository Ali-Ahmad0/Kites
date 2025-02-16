let isDarkMode : boolean = true;

// Switch between light and dark mode
export function toggleTheme() : void {
    // Change theme
    if (isDarkMode) {
        document.documentElement.classList.add("light");
    } else {
        document.documentElement.classList.remove("light");
    }

    // Update theme
    isDarkMode = !isDarkMode;
}