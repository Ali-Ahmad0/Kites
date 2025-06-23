<script lang="ts">
	import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { sidebar_collapsed, Icon } from "$lib";
    import { onMount } from 'svelte';
    import { is_dark_mode } from '$lib';
    
    let folder = $state("dark_mode_icons");
    
    $effect(() => {
        folder = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    })
    
     // Function to check window size and update
     const check_window_size = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 1024) {
                sidebar_collapsed.set(true);
            } else {
                sidebar_collapsed.set(false);
            }
        }
    };

    function goto_account() {
        if (!page.data.user) {
            goto('/login/signin');
        }

        goto(`/main/user/${page.data.user.username}`);
    }
    
    onMount(() => {
        check_window_size();
        window.addEventListener('resize', check_window_size);
        
        return () => {
            window.removeEventListener('resize', check_window_size);
        };
    });
    
</script>
    <div class="sidebar" class:collapsed={$sidebar_collapsed}>
        <div class="menu-links">
            <div class="section">
                <button class:active={page.url.pathname === "/main/home"}  onclick={() => goto("/main/home")}>
                    <div class="icon-container">
                        <Icon mode={folder} name="home" width={20} height={30} alt="home" />
                    </div>
                    <span class:label-hidden={$sidebar_collapsed}>
                        Home Page
                    </span>
                </button>
                <button class:active={page.url.pathname === `/main/user/${page.data.user?.username}`} onclick={goto_account}>
                    <div class="icon-container">
                        <Icon mode={folder} name="account" width={20} height={30} alt="account"/>
                    </div>
                    <span class:label-hidden={$sidebar_collapsed}>My Account</span>
                </button>
            </div>
            <div class="section">
                <h4 class:label-hidden={$sidebar_collapsed}>Topics</h4>
                <button class:active={page.url.pathname === "/main/forum_posts/Art"} onclick={() => goto('/main/forum_posts/Art')}>
                    <div class="icon-container">
                        <Icon mode={folder} name="art" width={20} height={30} alt="art"/>
                    </div>
                    <span class:label-hidden={$sidebar_collapsed}>Art</span>
                </button>
                <button class:active={page.url.pathname === "/main/forum_posts/Philosophy"} onclick={() => goto('/main/forum_posts/Philosophy')}>
                    <div class="icon-container">
                        <Icon mode={folder} name="philosophy" width={20} height={30} alt="philosophy"/>
                    </div>
                    <span class:label-hidden={$sidebar_collapsed}>Philosophy</span>
                </button>
                <button class:active={page.url.pathname === "/main/forum_posts/Nature"} onclick={() => goto('/main/forum_posts/Nature')}>
                    <div class="icon-container">
                        <Icon mode={folder} name="nature" width={20} height={30} alt="nature"/>
                    </div>
                    <span class:label-hidden={$sidebar_collapsed}>Nature</span>
                </button>
                <button class:active={page.url.pathname === "/main/forum_posts/Science"} onclick={() => goto('/main/forum_posts/Science')}>
                    <div class="icon-container">
                        <Icon mode={folder} name="science" width={20} height={30} alt="science"/>
                    </div>
                    <span class:label-hidden={$sidebar_collapsed}>Science</span>
                </button>
            </div>
            <div class="section">
                <h4 class:label-hidden={$sidebar_collapsed}>More</h4>
                <button class:active={page.url.pathname === "/main/rules"} onclick={() => goto('/main/rules')}>
                    <div class="icon-container">
                        <Icon mode={folder} name="rules" width={20} height={30} alt="rules"/>
                    </div>
                    <span class:label-hidden={$sidebar_collapsed}>Rules</span>
                </button>
                <button class:active={page.url.pathname === "/main/ranks"} onclick={() => goto('/main/ranks')}>
                    <div class="icon-container">
                        <Icon mode={folder} name="verified" width={20} height={30} alt="verified"/>
                    </div>
                    <span class:label-hidden={$sidebar_collapsed}>Ranks</span>
                </button>
            </div>
        </div>
    </div>

<style>
    .sidebar {
        width: 11.5rem;
        height: calc(100vh - 8rem);
        
        padding: 1rem 0;
        
        transition: width 0.3s ease;
    }
    
    button {
        color: var(--color-text-primary);
        background-color: var(--color-background-primary);
        
        padding: 0.7rem 2rem;
        margin: 0.25rem 0;

        font-size: 1rem;
        width: 100%;
        
        border: none;
        border-radius: 1rem;
        
        cursor: pointer;
        
        text-align: left;
        
        display: flex;      
        align-items: center;  
        gap: 6px;    
    }

    button:hover {
        background-color: var(--color-background-secondary);
        transition: background-color 0.3s ease;
    }

    .menu-links {
        display: flex;
        flex-direction: column;
    }
    
    h4 {
        color: var(--color-text-secondary);
        margin: 0.5rem 0;
        padding: 0 2rem;
    }
    
    .section {
        padding-bottom: 1rem;
        border-bottom: solid 1px var(--color-navigation-border);
    }
    
    .section:last-child {
        border-bottom: none;
    }
    
    .sidebar.collapsed {
        width: 4rem;
    }

    .sidebar.collapsed button {
        justify-content: center;
        padding: 0.7rem 0;
    }
    
    .icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 20px;
    }

    .active {
        background-color: var(--color-background-secondary);
    }

    .label-hidden {
        opacity: 0;
        width: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        position: absolute;
    }
    
    .sidebar.collapsed h4 {
        display: none;
    }

    @media (max-width: 768px) {
        .sidebar {
            position: fixed;
            left: 0;
            top: 4.5rem;  
            height: calc(100vh - 4rem);

            z-index: 100;
            background: var(--color-background-primary);
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }

        .sidebar:not(.collapsed) {
            transform: translateX(0);
            width: 100%;
            max-width: 240px;
            padding: 1rem;
        }
    }
</style>