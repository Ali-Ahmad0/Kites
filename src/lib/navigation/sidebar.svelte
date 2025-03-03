<script lang="ts">
    import { sidebar_collapsed } from "$lib";
</script>

<div class="sidebar" class:collapsed={$sidebar_collapsed}>
    <div class="menu-links">
        <div class="section">
            <button>Home Page</button>
            <button>My Account</button>
        </div>
        <div class="section">
            <h4>Topics</h4>
            <button>Art</button>
            <button>Philosophy</button>
            <button>Nature</button>
            <button>Science</button>
        </div>
        <div class="section">
            <h4>More</h4>
            <button>Rules</button>
            <button>Github</button>
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

        border-right: solid 1px var(--color-navigation-border);
		
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
    }
    
    button:hover {
        background-color: var(--color-background-secondary);
        transition: background-color 0.3s ease;
    }
</style>