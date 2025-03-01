<script lang="ts">
	import { LoginCard } from "$lib";
	import type { PageProps } from "./$types";
    
	let { form } : PageProps = $props();
</script>

<LoginCard signin={false} form={form} />