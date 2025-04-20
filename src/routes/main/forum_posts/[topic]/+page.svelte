<script lang="ts">
	import { CreatePost, Thumbnail } from '$lib';

    const { data } = $props();


</script>

{#each data.posts as post }
    <Thumbnail post_id={post.id} username={post.author_name} 
    topic={post.topic} user_liked={post.user_liked} heading={post.heading} image={post.imageUrl}/>
{/each}

<CreatePost/>