<script lang="ts">
	import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { sidebar_collapsed, is_dark_mode, Icon } from "$lib";
    import { onMount } from 'svelte';
    
    // Reactive variables
    let folder: string = $state("dark_mode_icons");
    
    $effect(() => {
        folder = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    })
    
     // Function to check window size and update the store
     const check_window_size = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 1024) {
                sidebar_collapsed.set(true);
            } else {
                sidebar_collapsed.set(false);
            }
        }
    };

    function goto_account() {
        if (page.data.user === undefined) {
            goto('/login/signin');
        }

        goto(`/user/${page.data.user.username}`);
    }
    
    // Set up event listeners on mount and clean up on destroy
    onMount(() => {
        // Initial check
        check_window_size();
        
        // Add event listeners
        window.addEventListener('resize', check_window_size);
        
        // No need for 'load' event here since we're already mounted
        
        // Return cleanup function
        return () => {
            window.removeEventListener('resize', check_window_size);
        };
    });
    
</script>

<div class="sidebar" class:collapsed={$sidebar_collapsed}>
    <div class="menu-links">
        <div class="section">
            <button onclick={() => goto("/main/home")}>
                <Icon mode = {folder} name="home" width = {20} height = {30} alt = "home" />
                Home Page
            </button>
            <button onclick={goto_account}>
                <Icon mode = {folder} name="account" width = {20} height = {30} alt = "account"/>
                My Account
            </button>
        </div>
        <div class="section">
            <h4>Topics</h4>
            <button onclick={() => goto('/main/forum_posts/Art')}>
                <Icon mode = {folder} name="art" width = {20} height = {30} alt = "art"/>
                Art
            </button>
            <button onclick={() => goto('/main/forum_posts/Philosophy')}>
                <Icon mode = {folder} name="philosophy" width = {20} height = {30} alt =" philosophy"/>
                Philosophy
            </button>
            <button onclick={() => goto('/main/forum_posts/Nature')}>
                <Icon mode = {folder} name="nature" width={20} height={30} alt = "nature"/>
                Nature
            </button>
            <button onclick={() => goto('/main/forum_posts/Science')}>
                <Icon mode = {folder} name="science" width={20} height={30} alt = "science"/>
                Science
            </button>
        </div>
        <div class="section">
            <h4>More</h4>
            <button>
                <Icon mode = {folder} name="rules" width={20} height={30} alt = "rules"/>
                Rules
            </button>
            <button>
                <Icon mode = {folder} name="github" width={20} height={30} alt = "github"/>
                Github
            </button>
        </div>
    </div>
</div>

<style>
    .sidebar {
        width: 12rem;
        height: calc(100vh - 8rem);
		
		margin: 0.5rem auto;
		padding-top: 1rem;
		padding-right: 0.5rem;
		
		transition: width 0.3s ease;
    }
    
    .sidebar.collapsed {
        width: 0;
        overflow: hidden;

		border-right: none;
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
    
    button {
        color: var(--color-text-primary);
        background-color: var(--color-background-primary);
        
		padding: 0.7rem 2rem;
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
</style>