<script lang="ts">
    import { ForumPost } from "$lib";
    const { data } = $props();
</script>

<ForumPost heading={data.heading} username={data.author} content={data.content} topic={data.topic}/>