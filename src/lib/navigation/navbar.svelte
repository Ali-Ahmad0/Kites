<script lang="ts">
    import { toggleTheme } from "$lib";
</script>

<header>
    <h2>KITES</h2>
    <nav>
        <ul class="navbar-links">
            <li><button>About</button></li>
            <li><button>Notifications</button></li>
            <li><button onclick="{toggleTheme}">Toggle Theme</button></li>
        </ul>
    </nav>
    <button class="login-button">Log In</button>
</header>

<style>
    h2 {
        margin-right: auto;
    }

    header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 10%;
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
        background-color: var(--color-dark-primary);
        color: var(--color-text-primary);
        
        border: none;
        
        font-size: 1rem;
        transition: none;
    }

    .navbar-links li:hover, button:hover {
        transition: color 0.3s ease 0s;

        color: var(--color-text-secondary);
        background-color: var(--color-dark-primary);
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
</style>