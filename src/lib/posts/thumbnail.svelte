<script>
    const { post_id, username, topic, heading } = $props();
</script>

<a href='forum_posts/{post_id}'>
    <div class="post">
        <div class="header">
            <img src="/profile.jpg" alt="pfp" class="pfp">
            <span class="username">{username}</span>
            <span class="topic"><strong>{topic}</strong></span>
        </div>
        <h3 class="title">{heading}</h3>
        <img src="/default.jpg" alt="cover" class="cover">
        
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
</a>

<style>
    a {
        text-decoration: none;
    }
    
    .post {
        background-color: var(--color-background-secondary);
        border-radius: 0.5rem;
        padding: 0.75rem;
        margin: 1rem 4rem 1rem 6rem;
        max-width: 600px;
    }
    
    .header {
        display: flex;
        align-items: center;
    }

    .pfp {
        border-radius: 50%;
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.5rem;
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
    
    .engagement {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
    }
    
    .engagement-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
     
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        background: transparent;
        border-color: transparent;
     
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
    
    @media (max-width: 768px) {
        .engagement {
            flex-wrap: wrap;
        }
        
        .engagement-btn {
            flex: 1;
            justify-content: center;
        }
    }
</style>