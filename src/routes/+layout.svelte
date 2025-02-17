<script lang="ts">
	import { Navbar } from "$lib";

	import '../app.css';
	let { children } = $props();
</script>

<Navbar />
{@render children()}