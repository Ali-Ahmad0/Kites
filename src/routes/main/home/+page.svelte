<script lang="ts">
    import { Thumbnail } from "$lib";

    const { data } = $props();

    const posts: any = data.posts;

    // if (Array.isArray(data.posts)) {
    //     posts = data.posts;
    // } else {
    //     posts = []
    // }

    console.log(data)
    
</script>

{#each posts as post}
    <Thumbnail post_id={post.id} username={post.author_name} topic={post.topic} heading={post.heading} image={post.imageUrl}/>
{/each}

