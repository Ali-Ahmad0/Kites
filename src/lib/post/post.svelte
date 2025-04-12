<script lang="ts">
    import { Icon, Tooltip, is_dark_mode } from "$lib";

    // Dynamic icon folder based on dark mode
    let folder: string = $state("dark_mode_icons");

    // Simulated comment data from DB
    let comments = $state([
        {
            id: 1,
            author: "Abeha",
            text: "This is so helpful!",
        },
        {
            id: 2,
            author: "Ali",
            text: "Interesting perspective, I like it!",
        },
        {
            id: 3,
            author: "Zainab",
            text: "I have a question...",
        }
    ]);

    // Update folder on dark mode change
    $effect(() => {
        folder = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    });

</script>

<div class="container">
    <div class="details">
        <a href="-" class="author">
            <img class="profile-image" src="/profile.jpg" alt="user's profile">
            <p class="user-name">Username</p>
        </a>   
        <p class="topic">Art</p>
    </div>
    
    <div class="post">
        <h1 class="title">Title</h1>
        
        <p class="content">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus error, hic eveniet maiores magni veniam? Possimus accusantium eos sunt alias eveniet ratione, molestiae veritatis explicabo nihil. Magni iste totam delectus mollitia numquam repellendus eligendi quod et sapiente, repudiandae quas consectetur quaerat excepturi illo iure, molestias ducimus rerum deserunt vero, vitae nemo eum impedit nobis. Esse quos quas ducimus cupiditate consequuntur consectetur praesentium sunt sed?
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


    <!-- Comments List -->
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
    {/each}
</div>

<style>
    .container{
        display: flex;
        flex-direction: column;
        width: 78rem;
    }

    .details {
        display: flex;
    }

    .author {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 1.2rem;
    }

    .profile-image {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        margin-left: 10rem;
        margin-top: 1rem;
    }

    .user-name {
        color: var(--color-text-primary);
        margin-top: 2.5rem;
    }

    .topic {
        margin-left: 33rem;
        margin-top: 2.5rem;
        color: var(--color-text-primary);
    }

    .title {
        color: var(--color-text-primary);
        margin-left: 10rem;
        margin-top: 1rem;
    }

    .post-image {
        width: 30rem;
        height: 35rem;
        border-radius: 0.5rem;
        margin-left: 16rem;
        margin-top: 2.5rem;
    }

    .content {
        margin-left: 10rem;
        margin-right: 23rem;
    }

    .comment {
        max-width: 61.25rem;
        margin-left: 10rem;
        margin-right:23rem;
        margin-top:2rem;
        font-size: 14px;
        padding: 0 1.25rem;
        max-height: 37.5rem;
        overflow-y: auto;
        margin-bottom: 1rem;
        padding-bottom: 1rem;

        border-bottom: 0.0625rem solid var(--color-navigation-border);
    }

    .comment:last-child {
        border-bottom: none;
    }

    .comment-wrapper {
        display: flex;
        gap: 1.2rem;
    }

    .comment-avatar {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        margin: 0;
    }

    .comment-content {
        flex: 1;
    }

    .comment-header {
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        gap: 1.2rem;
        flex-wrap: wrap;
    }

    .comment-author {
        font-weight: 500;
        margin-top: 0.4rem;
        color: var(--color-text-primary);
    }

    .comment-time {
        color: var(--color-text-secondary);
        font-size: 0.75rem;
        margin-top: 0.3rem;
    }

    .comment-text {
        margin-bottom: 0.5rem;
        margin-top: 1rem;
        color: var(--color-text-primary);
        line-height: 1.5;
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

    
</style>