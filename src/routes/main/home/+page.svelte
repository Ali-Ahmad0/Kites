<script lang="ts">
    import { Thumbnail, Featured } from "$lib";
    
    const { data } = $props();
</script>

{#each data.posts as post}
    <Thumbnail post_id={post.id} pfp={post.author_pfp} username={post.author_name} 
    topic={post.topic} heading={post.heading} user_liked={post.user_liked} image={post.image_url} type={post.type}/>
{/each}

<Featured posts={data.featured_posts} />