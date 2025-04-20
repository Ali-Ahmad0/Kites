<script lang="ts">
    import { Thumbnail } from "$lib";

    const { data } = $props();

    const posts: any = data.posts;
</script>

{#each posts as post}
    <Thumbnail post_id={post.id} username={post.author_name} topic={post.topic} 
    heading={post.heading} user_liked={post.user_liked} image={post.imageUrl}/>
{/each}

