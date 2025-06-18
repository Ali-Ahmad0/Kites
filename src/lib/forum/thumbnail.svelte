<script>
	import { goto } from "$app/navigation";
	import { Engagement } from "$lib";

    const { 
        post_id, 
        user_liked, 
        pfp, 
        username, 
        topic, 
        heading, 
        image, 
        type
    } = $props();

</script>

<div class="post">
    <div class="header">
        {#if pfp}
        <button class="pfp-button" onclick={() => goto(`/main/user/${username}`)}>
            <img src={pfp} alt="pfp" class="pfp">
        </button>
        {:else}
        <button class="pfp-button" onclick={() => goto(`/main/user/${username}`)}>
            <img class="pfp" src="/profile.jpg" alt="pfp">
        </button>
        {/if}
        <span class="username">{username}</span>
        <span class="topic"><strong>{topic} | {type}</strong></span>
    </div>
    <a href='/main/forum_posts/{topic}/{post_id}'>
        <h3 class="title">{heading}</h3>
        {#if image}
          <img src={image} alt="cover" class="cover">
        {/if}
    </a>
    <Engagement post_id={post_id} topic={topic} user_liked={user_liked} />
</div>    

<style>
    a {
        text-decoration: none;
    }
    
    .post {
        background-color: var(--color-background-secondary);
        border-radius: 0.5rem;
        padding: 0.75rem 1.5rem;
        margin: 1rem 4rem 1rem 6rem;

        width: 45vw;
        min-width: 400px;
        max-width: 900px;
    }
    
    .header {
        display: flex;
        align-items: center;
    }

    .pfp-button {
        padding: 0;
        margin: 0;

        background: transparent;
        border: none;
        
        cursor: pointer;
    }

    .pfp {
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        margin-right: 0.75rem;
        margin-top: 0.25rem;
    }
    
    .username, .topic {
        color: var(--color-text-secondary);
        font-size: 0.9rem;
    }

    .topic {
        margin-left: auto;
        margin-right: 0.5rem;
    }
    
    .title {
        margin-bottom: 0.7rem;
        margin-top: 0;
        color: var(--color-text-primary);
    }

    .cover {
        width: 100%;
        border-radius: 1rem;
        border: 1px solid var(--color-text-primary);
    }

    @media (max-width: 768px) {
        .post {
            width: 64vw;
            min-width: 500px;
        }
    }
    
</style>