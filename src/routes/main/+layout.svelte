<script lang="ts">
    import { Navbar } from "$lib";
	import { Sidebar } from "$lib";
    let { children } = $props();
</script>

<Navbar />
<Sidebar/>
{@render children()}

