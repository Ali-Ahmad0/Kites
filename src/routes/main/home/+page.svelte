<script lang="ts">
    import { Thumbnail } from "$lib";

    const { data } = $props();
</script>

<!-- {#each data.posts as post }
    <h2>{post.heading}</h2>
    <p>{post.content}</p>
{/each} -->

<Thumbnail username="Ali" topic="Art" heading="Example Post" />
<Thumbnail username="Ali" topic="Art" heading="Example Post" />
<Thumbnail username="Ali" topic="Art" heading="Example Post" />
