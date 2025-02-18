<script lang="ts">
    import { Navbar } from "$lib";
    let { children } = $props();
</script>

<Navbar />
{@render children()}