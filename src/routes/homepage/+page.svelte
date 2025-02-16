<script lang="ts">
    import { toggleTheme } from "$lib"
</script>

<div class="test">
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
    <button onclick="{toggleTheme}">Change Theme</button>
</div>

<style>
    /* Basic test styling */
    .test {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    button {
        color: #ffffff;
        background-color: var(--color-blue-primary);
        padding: 0.5rem;
        border-radius: 1rem;
        border: none;
    }
</style>

