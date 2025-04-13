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
    }

    .layout.collapsed {
        grid-template-columns: 0 1fr;
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
    }
    .content {
        grid-area: content;
        overflow-y: auto;
        
        padding: 1rem;
    }
</style>