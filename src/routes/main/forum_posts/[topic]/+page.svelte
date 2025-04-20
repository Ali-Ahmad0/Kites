<script lang="ts">
	import { CreatePost, Thumbnail } from '$lib';

    const { data } = $props();
</script>

{#each data.posts as post }
    <Thumbnail post_id={post.id} user_liked={post.user_liked} 
    username={post.author_name} topic={post.topic} heading={post.heading} />
{/each}

<CreatePost/>