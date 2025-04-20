<script lang="ts">
    import { Navbar } from "$lib";
    import { Sidebar } from "$lib";
    import { sidebar_collapsed } from "$lib";
   
    let { children } = $props();
</script>

<div class="layout" class:collapsed={$sidebar_collapsed}>
    <div class="navbar">
        <Navbar />
    </div>
    <div class="sidebar">
        <Sidebar />
    </div>
    <main class="content">
        {@render children()}
    </main>
</div>

<style>
    .layout {
        display: grid;
        grid-template-areas:
            "navbar navbar"
            "sidebar content";
        grid-template-rows: auto 1fr;
        grid-template-columns: auto 1fr;
        height: 97vh;
        transition: grid-template-columns 0.3s ease;
    }

    .layout.collapsed {
        grid-template-columns: 4rem 1fr;
    }

    .navbar {
        grid-area: navbar;
        position: sticky;
        top: 0;
        z-index: 2;
    }
    
    .sidebar {
        grid-area: sidebar;
        overflow-y: auto;
        position: sticky;
        top: 4rem;
        z-index: 1;
        width: 11.5rem;
        transition: width 0.3s ease;
    }
    
    .layout.collapsed .sidebar {
        width: 4rem;
    }
    
    .content {
        grid-area: content;
        overflow-y: auto;
        padding: 1rem;
    }
</style>