<script lang="ts">
    const { data } = $props();
</script>

{#each data.posts as post }
    <h2>{post.heading}</h2>
    <p>{post.content}</p>
{/each}