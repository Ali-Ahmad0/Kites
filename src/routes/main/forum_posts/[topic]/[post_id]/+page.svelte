<script lang="ts">
    import { ForumPost } from "$lib";
    const { data } = $props();
</script>

<ForumPost 
post_id={data.post_id} user_liked={data.user_liked} pfp={data.author_pfp}
heading={data.heading} username={data.author} content={data.content} topic={data.topic}
comments={data.comments} image={data.image} type={data.type}
/>