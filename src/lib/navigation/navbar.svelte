<script lang="ts">
    import { sidebar_collapsed, toggle_theme } from "$lib";
    import { goto } from "$app/navigation";

    function toggle_sidebar() {
        sidebar_collapsed.update((value) => !value);
    }

</script>

<header>
    <button onclick={toggle_sidebar} class="sidebar-button">
		☰
	</button>
    <h2>KITES</h2>
    <nav>
        <ul class="navbar-links">
            <li><button>About</button></li>
            <li><button>Notifications</button></li>
            <li><button onclick="{toggle_theme}">Toggle Theme</button></li>
        </ul>
    </nav>
    <button onclick="{() => goto("/login/signin")}" class="login-button">Log In</button>
</header>

<style> 
    header {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        height: 4rem;        
        padding: 0 1rem;
        
        position: relative; 
        z-index: 1;

        border-bottom: solid 1px var(--color-navigation-border);
    }

    h2 {
        margin-right:auto;
    }

    .navbar-links {
        text-align: center;
        
        list-style: none;
        
        display: inline-flex;
        gap: 1.5rem;
        
        padding: 0 1rem;
        margin-right: 1rem;
    }

    button {
        cursor: pointer;
    }

    .navbar-links button {
        transition: color 0.3s ease 0s;
    }

    .navbar-links button {
        background-color: var(--color-background-primary);
        color: var(--color-text-primary);
        
        border: none;
        
        font-size: 1rem;
        
        transition: none;
    }

    .navbar-links li:hover, button:hover {
        color: var(--color-text-secondary);
        background-color: var(--color-background-primary);

        transition: color 0.3s ease 0s;
    }

    .login-button {
        padding: 0.55rem 1.5rem;
        font-size: 1rem;

        border: none;
        border-radius: 1rem;

        background-color: var(--color-blue-primary);
        color: var(--color-text-button);
        
        transition: background-color 0.3s ease, color 0.3s ease !important; 
    }

    .login-button:hover {
        background-color: var(--color-blue-secondary);
        color: var(--color-text-button);
    }

    .sidebar-button {
        background-color: var(--color-background-primary);
        color: var(--color-text-primary);
        border: none;

        font-size: 1.5rem;
        margin-right: 1rem;
    }
</style>