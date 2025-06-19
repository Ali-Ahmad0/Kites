<script lang="ts">
    import { Navbar, Sidebar, CreatePost, sidebar_collapsed } from "$lib"
    let { data, children } = $props();
</script>

<svelte:head>
    <title>Kites</title>
</svelte:head>

<div class="layout" class:collapsed={$sidebar_collapsed}>
    <div class="navbar">
        <Navbar image={data.my_pfp} />
    </div>
    <div class="sidebar">
        <Sidebar />
    </div>
    <main class="content">
        {@render children()}
        <CreatePost/>
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

    @media (max-width: 1024px) {
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;

            max-width: 800px;
            width: 100%;
            padding: 0 1rem;
            box-sizing: border-box;
        }
    }

    @media (max-width: 768px) {
        .layout {
            grid-template-columns: 0 1fr;

            grid-template-areas:
                "navbar navbar"
                "content content"; 
        }

        .layout.collapsed .sidebar {
            width: 0;
        }

        .sidebar {
            grid-area: unset;
        }
    }
</style>