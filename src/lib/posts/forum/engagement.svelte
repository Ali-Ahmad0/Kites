<script lang="ts">
	import { goto } from "$app/navigation";
	import { error } from "@sveltejs/kit";

    const { post_id, user_liked } = $props();

    let liked = $state(user_liked);
    
    async function handle_like_button() {
        try {
            // Temporarily update like status
            liked = !liked;

            // Send API request to like/unlike post
            const response = await fetch('/api/like_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id: post_id, 
                    action: liked ? 'like' : 'unlike'
                })
            });

            // Reverse status if error
            if (response.status !== 200) {
                liked = !liked;
            }

            if (response.status === 401) {
                goto('/login/signin');
            }
        } catch (e) {
            throw error(500, `Error: ${e}`);
        }
    }
</script>

<div class="engagement">
    <button class="engagement-btn like-btn {liked ? 'liked' : ''}" onclick={handle_like_button}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={liked ? "#f43f5e" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

<style>
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

    .like-btn:hover, 
    .like-btn.liked {
        color: #f43f5e;
    }

    .like-btn.liked:hover svg {
        fill: none;
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