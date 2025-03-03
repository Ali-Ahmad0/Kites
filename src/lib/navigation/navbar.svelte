<script lang="ts">
    import { sidebar_collapsed, toggle_theme } from "$lib";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    
    function toggle_sidebar() {
        sidebar_collapsed.update((value) => !value);
    }
    
    async function logout() {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/';
    }
</script>

<header>
    <button on:click={toggle_sidebar} class="sidebar-button">
        ☰
    </button>
    <h2>KITES</h2>
    <nav>
        <ul class="navbar-links">
            <li><button>About</button></li>
            <li><button>Notifications</button></li>
            <li><button on:click={toggle_theme}>Toggle Theme</button></li>
        </ul>
    </nav>
    {#if page.data.authenticated}
        <button on:click={logout} class="login-button">Log Out</button>
    {:else}
        <button on:click={() => goto("/login/signin")} class="login-button">Log In</button>
    {/if}
</header>

<style>
    header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        
        height: 4rem;        
        padding: 0 1rem;
        
        border-bottom: solid 1px var(--color-navigation-border);
    }
    
    h2 {
        margin-right: auto;
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
        background-color: var(--color-background-primary);
        color: var(--color-text-primary);
        
        border: none;
        font-size: 1rem;
    }
    
    .navbar-links li:hover, button:hover {
        color: var(--color-text-secondary);
    }
    
    .login-button {
        padding: 0.55rem 1.5rem;
        font-size: 1rem;
        
        border: none;
        border-radius: 1rem;
        
        background-color: var(--color-blue-primary);
        color: var(--color-text-button);
        
        transition: background-color 0.3s ease;
    }
    
    .login-button:hover {
        background-color: var(--color-blue-secondary);
        color: var(--color-text-button);
    }
    
    .sidebar-button {
        background-color: transparent;
        color: var(--color-text-primary);
        
        border: none;
        
        font-size: 1.5rem;
        margin-right: 1rem;
    }
</style>