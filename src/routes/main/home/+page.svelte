<script lang="ts">
    import { Thumbnail, Featured } from "$lib";
    
    const { data } = $props();
    const { posts, featured_posts } = data;
</script>

{#each posts as post}
    <Thumbnail post_id={post.id} pfp={post.author_pfp} username={post.author_name} 
    topic={post.topic} heading={post.heading} user_liked={post.user_liked} image={post.image_url} type={post.type}/>
{/each}

<Featured posts={featured_posts} />