<script lang="ts">
    import { Thumbnail } from "$lib";

    const { data } = $props();

    const posts: any = data.posts;
</script>

{#each posts as post}
    <Thumbnail post_id={post.id} pfp={data.pfp} username={post.author_name} topic={post.topic} 
    heading={post.heading} user_liked={post.user_liked} image={post.image_url}/>
{/each}

