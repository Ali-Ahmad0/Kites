<script lang="ts">
    import { Icon, Tooltip, is_dark_mode } from "$lib";

    // Dynamic icon folder based on dark mode
    let folder: string = $state("dark_mode_icons");

    const {heading, username, content, topic} = $props();

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
        
        <img src="/orange.jpeg" alt="" class="post-image">
        <div class="engagement">
            <button class="engagement-btn like-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>Like</span>
            </button>
            <button class="engagement-btn comment-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span>Comment</span>
            </button>
            <button class="engagement-btn share-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>Share</span>
            </button>
        </div>
    </div>

    <!-- Comments List
    {#each comments as comment}
        <div class="comment">
            <div class="comment-wrapper">
                <img class="comment-avatar" src="/profile.jpg" alt="avatar" />
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">{comment.author}</span>
                        <span class="comment-time"> • 2d ago</span>
                    </div>
                    <div class="comment-text">{comment.text}</div>
                </div>
            </div>
        </div>
    {/each} -->
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

    .engagement {
        display: flex;
        gap: 0.75rem;
        margin: 1rem 0;
    }
    
    .engagement-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        background: transparent;
        border: none;
        color: var(--color-text-secondary);
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .like-btn:hover {
        color: #f43f5e;
    }
    
    .comment-btn:hover {
        color: #3b82f6;
    }
    
    .share-btn:hover {
        color: #10b981;
    }

    /* .comment {
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

    .comment-time {
        color: var(--color-text-secondary);
        font-size: 0.75rem;
    }

    .comment-text {
        color: var(--color-text-primary);
        line-height: 1.5;
        margin: 0;
    } */

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .container {
            padding: 0 0.5rem;
        }
        
        .post-image {
            max-height: 350px;
        }
        
        .engagement {
            flex-wrap: wrap;
        }
    }
</style>