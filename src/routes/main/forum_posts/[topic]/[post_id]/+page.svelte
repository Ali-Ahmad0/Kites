<script lang="ts">
    import { DiscussionPost, BlogPost } from "$lib";
    const { data } = $props();
</script>

{#if data.type === 'discussion'}
    <DiscussionPost
    post_id={data.post_id} user_liked={data.user_liked} pfp={data.author_pfp}
    heading={data.heading} username={data.author} content={data.content} topic={data.topic}
    comments={data.comments} image={data.image} type={data.type} user_id={data.user_id}
    />
{:else}
    <BlogPost
    post_id={data.post_id} user_liked={data.user_liked} pfp={data.author_pfp}
    heading={data.heading} username={data.author} content={data.content} topic={data.topic}
    comments={data.comments} image={data.image} type={data.type} user_id={data.user_id}
    />
{/if}