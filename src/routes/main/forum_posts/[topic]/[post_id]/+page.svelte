<script lang="ts">
    import { DiscussionPost, BlogPost, Loading } from "$lib";
    const { data } = $props();
</script>

{#await data.streamed}
    <Loading text="Loading post..."/>
{:then post_data} 
    {#if post_data.post.type === 'discussion'}
        <DiscussionPost
            post_id={post_data.post.id} user_liked={post_data.user_liked} pfp={post_data.author_pfp}
            heading={post_data.post.heading} username={post_data.post.author_name} content={post_data.post.content} topic={post_data.post.topic}
            comments={post_data.comments} image={post_data.image} type={post_data.post.type} user_id={post_data.user_id}
        />
    {:else}
        <BlogPost
            post_id={post_data.post.id} user_liked={post_data.user_liked} pfp={post_data.author_pfp}
            heading={post_data.post.heading} username={post_data.post.author_name} content={post_data.post.content} topic={post_data.post.topic}
            comments={post_data.comments} image={post_data.image} type={post_data.post.type} user_id={post_data.user_id}
        />
    {/if}
{/await}