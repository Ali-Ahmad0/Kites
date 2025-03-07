<script lang="ts">
    import { sidebar_collapsed, toggle_theme, is_dark_mode, Icon } from "$lib";
    import { page } from "$app/state";
    
    let mode : string = $state("dark_mode_icons");
    let theme_icon : string = $state("dark_mode");

    $effect(() => {
        mode = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
        theme_icon = $is_dark_mode ? "dark_mode" : "light_mode";
    });
    
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
            <li><button><Icon mode = {mode} name = "about_us" width = {24} height = {24} alt = "about_us"/></button></li>
            <li><button><Icon mode = {mode} name = "notification_bell" width = {24} height = {24} alt = "notification_bell" /></button></li>
            <li><button onclick={() => { toggle_theme(); }}><Icon mode = {mode} name = {theme_icon} width = {24} height = {24} alt = "light_mode" />
            </button>
            </li>
        </ul>
    </nav>
    {#if page.data.authenticated}
        <button onclick={() => window.location.href = `/main/user/${page.data.user.username}`} class="profile">
            <img class="pfp" src="/profile.jpg" alt="pfp">
        </button>
    {:else}
        <button onclick={() => window.location.href = "/login/signin"} class="login-button">Log In</button>
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

    .sidebar-button {
        background-color: transparent;
        color: var(--color-text-primary);
        
        border: none;
        
        font-size: 1.5rem;
        margin-right: 1rem;
    }
    
    h2 {
        margin-right: auto;
    }
    
    .navbar-links {
        text-align: center;
        list-style: none;
        
        display: inline-flex;
        gap: 1.5rem;
        
        margin-top: 1.2rem;
        padding: 0 1rem;
    }
    
    button {
        cursor: pointer;
        
        background-color: transparent;
        border: none;

        transition: opacity 0.3s ease;
        
    }

    button:hover {
        opacity: 0.7;
    }
    
    .login-button {
        padding: 0.5rem 1.25rem;
        margin: 0 1rem;

        font-size: 1rem;
        
        border: none;
        border-radius: 1.5rem;
        
        background-color: var(--color-blue-primary);
        color: var(--color-text-button);
        
        transition: background-color 0.3s ease;
    }
    
    .login-button:hover {
        background-color: var(--color-blue-secondary);
        color: var(--color-text-button);
    }

    .profile {
        margin: 0 1rem;

        background-color: transparent;
        border: none;
    }

    .pfp {
        width: 2.5rem;
        height: 2.5rem;
        
        border-radius: 50%;
        border: solid 2px;
        border-color: var(--color-background-secondary);

        transition: opacity 0.3s ease;
    }

    .pfp:hover {
        opacity: 0.7;
    }

</style>