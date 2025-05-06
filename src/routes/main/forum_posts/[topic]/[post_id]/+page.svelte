<script lang="ts">
    import { DiscussionPost, BlogPost } from "$lib";
    const { data } = $props();
</script>

{#if data.post.type === 'discussion'}
    <DiscussionPost
    post_id={data.post.id} user_liked={data.user_liked} pfp={data.author_pfp}
    heading={data.post.heading} username={data.post.author_name} content={data.post.content} topic={data.post.topic}
    comments={data.comments} image={data.image} type={data.post.type} user_id={data.user_id}
    />
{:else}
    <BlogPost
    post_id={data.post.id} user_liked={data.user_liked} pfp={data.author_pfp}
    heading={data.post.heading} username={data.post.author_name} content={data.post.content} topic={data.post.topic}
    comments={data.comments} image={data.image} type={data.post.type} user_id={data.user_id}
    />
{/if}