<script lang="ts">
    import { sidebar_collapsed, toggle_theme, is_dark_mode, Icon, Tooltip } from "$lib";
    import { page } from "$app/state";
	import { goto } from "$app/navigation";

    let folder: string = $state("dark_mode_icons");

    $effect(() => {
        folder = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    });
    
    function toggle_sidebar() {
        sidebar_collapsed.update((value) => !value);
    }
</script>

<header>

    <Tooltip text="Sidebar">
    <div class="icon-wrapper">
        <button onclick={toggle_sidebar} class="sidebar-button">
            ☰
        </button>
    </div>
    </Tooltip>

    <h2>KITES</h2>
    <nav>
        <ul class="navbar-links">
            <li>
                <Tooltip text="About US">
                    <button class="icon">
                        <Icon mode = {folder} name = "about_us" width = 24 height = 24 alt = "about_us"/>
                    </button>
                </Tooltip>
            </li>
            <li>
                <Tooltip text="Notifications">
                      <button class="icon">
                        <Icon mode = {folder} name = "notification_bell" width=24 height=24 alt = "notification_bell"/>
                    </button>        
                </Tooltip>           
            </li>
            <li>
                <Tooltip text="Change Theme">
                    <button class="icon" onclick={() => { toggle_theme(); }}>
                        <Icon mode={folder} name="toggle_theme" width=24 height=24 alt = "toggle_theme" />
                    </button>
                </Tooltip>
            </li>
        </ul>
    </nav>
    {#if page.data.authenticated}
        <Tooltip text="Profile">
                <button onclick={() => goto(`/main/user/${page.data.user.username}`)} class="profile">
                    <img src="/profile.jpg" alt="pfp" class="pfp">
                </button>       
        </Tooltip>
        
    {:else}
        <button onclick={() => goto("/login/signin")} class="login-button">Log In</button>
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

        transition: background-color 0.3s ease;
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
    
    .icon {
        cursor: pointer;
        background-color: transparent;
        border: none;
        transition: all 0.2s ease;
    }

    .icon:hover {
        opacity: 0.7;
        transform: translateY(-2px);
        
    }
    
    .login-button {
        padding: 0.5rem 1.25rem;
        margin: 0 1rem;

        font-size: 1rem;
        
        border: none;
        border-radius: 1.5rem;
        
        background-color: var(--color-blue-primary);
        color: var(--color-text-button);
        
        transition: all 0.3s ease;
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

    .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>