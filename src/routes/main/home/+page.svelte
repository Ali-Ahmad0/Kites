<script lang="ts">
    import { Thumbnail } from "$lib";

    const { data } = $props();
</script>

{#each data.posts as post }
    <Thumbnail post_id={post.id} username="Ali" topic={post.topic} heading={post.heading} />
{/each}

