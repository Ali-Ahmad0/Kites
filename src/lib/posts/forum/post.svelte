<script lang="ts">
    import { is_dark_mode } from "$lib";	
    import { Engagement } from "$lib";

    const { 
        post_id, user_liked,
        heading, username, content, topic,
        comments, image
    } = $props();

    // Dynamic icon folder based on dark mode
    let folder: string = $state("dark_mode_icons");
  
    // Update folder on dark mode change
    $effect(() => {
        folder = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    });

</script>

<div class="container">
    <div class="details">
        <a href="-" class="author">
            <img class="profile-image" src="/profile.jpg" alt="user's profile">
            <p class="user-name">{username}</p>
        </a>   
        <p class="topic">{topic}</p>
    </div>
    
    <div class="post">
        <h1 class="title">{heading}</h1>
        
        <p class="content">
            {content}
        </p>
        <img src={image} alt="" class="post-image">
        <Engagement post_id={post_id} user_liked={user_liked}/>
    </div>

    {#each comments as comment_data}
        <div class="comment">
            <div class="comment-wrapper">
                <img class="comment-avatar" src="/profile.jpg" alt="avatar" />
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">{comment_data.author_name}</span>
                    </div>
                    <div class="comment-text">{comment_data.comment}</div>
                </div>
            </div>
        </div>
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding: 1rem 0;
    }

    .author {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .profile-image {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        object-fit: cover;
    }

    .user-name {
        color: var(--color-text-primary);
        margin: 0;
        font-weight: 500;
    }

    .topic {
        color: var(--color-text-primary);
        margin: 0;
        font-weight: 500;
    }

    .post {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        border-bottom: 1px solid var(--color-navigation-border);
    }

    .title {
        color: var(--color-text-primary);
        margin: 0;
        font-size: 1.75rem;
    }

    .content {
        color: var(--color-text-primary);
        line-height: 1.6;
        margin: 0;
    }

    .post-image {
        width: 100%;
        max-height: 500px;
        border-radius: 0.5rem;
        object-fit: contain;
        align-self: center;
    }

    .comment {
        padding: 1rem 0;
        border-bottom: 1px solid var(--color-navigation-border);
    }

    .comment:last-child {
        border-bottom: none;
    }

    .comment-wrapper {
        display: flex;
        gap: 1rem;
    }

    .comment-avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        object-fit: cover;
    }

    .comment-content {
        flex: 1;
    }

    .comment-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
    }

    .comment-author {
        font-weight: 500;
        color: var(--color-text-primary);
    }

    .comment-text {
        color: var(--color-text-primary);
        line-height: 1.5;
        margin: 0;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .container {
            padding: 0 0.5rem;
        }
        
        .post-image {
            max-height: 350px;
        }
    }
</style>