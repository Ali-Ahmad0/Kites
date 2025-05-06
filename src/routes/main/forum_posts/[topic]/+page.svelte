<script lang="ts">
	import { Thumbnail, Featured } from '$lib';

    const { data } = $props();
</script>

{#each data.posts as post }
    <Thumbnail post_id={post.id} username={post.author_name} pfp={post.author_pfp}
    topic={post.topic} user_liked={post.user_liked} heading={post.heading} image={post.image_url} type={post.type}/>
{/each}

<Featured/>