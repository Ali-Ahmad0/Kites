<script lang="ts">
    import { goto } from "$app/navigation";
	import { page } from "$app/state";
    import { fade, scale } from 'svelte/transition';

    const { 
        post_id, 
        topic, 
        user_liked 
    } = $props();

    let liked = $state(user_liked);
    let show_modal = $state(false);
    
    let comment_text = $state("");
    let is_submitting = $state(false);
    
    async function handle_like_button() {
        if (!page.data.authenticated) {
            goto('/login/signin');
            return;
        }

        try {
            // Temporarily update like status
            liked = !liked;

            // Send API request to like/unlike post
            const response = await fetch('/api/forum/like', {
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
                const data = await response.json();
                alert(data.error);
            }
        } catch (e) {
            console.error('[KITES | ERROR]: ', e);
        }
    }
    
    function toggle_modal() {
        if (!(page.data.user && page.data.authenticated)) {
            goto('/login/signin');
            return;
        }
        
        show_modal = !show_modal;
        if (show_modal) {
            // Reset comment text when opening
            comment_text = "";
        }
    }
    
    async function submit_comment() {
        if (!comment_text.trim()) 
            return;
        
        try {
            is_submitting = true;
            
            const response = await fetch('/api/forum/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id: post_id,
                    comment: comment_text
                })
            });

            if (response.status === 401) {
                goto('/login/signin');
                return;
            }

            if (response.status !== 200) {
                console.error('[KITES | ERROR]: Error submitting comment');
            }

            // Success - close modal and reset
            comment_text = "";
            show_modal = false;

            const url = `/main/forum_posts/${topic}/${post_id}`
            window.location.href = url;
        } catch (e) {
            console.error('[KITES | ERROR]: Error submitting comment:', e);
        } finally {
            is_submitting = false;
        }
    }

    function copy_to_clipboard() {
        // Create absolute URL to the specific post
        const path = `/main/forum_posts/${topic}/${post_id}`;
        const absolute_url = new URL(path, window.location.origin).toString();
        
        navigator.clipboard.writeText(absolute_url)
            .then(() => {
                alert("URL copied to clipboard!");
            })
            .catch(err => {
                console.error('[KITES | ERROR]: Could not copy text: ', err);
            });
    }
        
    // Close modal when clicking outside
    function handle_outside_click(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('modal-backdrop')) {
            show_modal = false;
        }
    }
    
    // Keyboard event handler for modal backdrop
    function handle_backdrop_keydown(event: KeyboardEvent) {
        // Close modal on Escape key
        if (event.key === 'Escape') {
            show_modal = false;
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
    <button class="engagement-btn comment-btn" onclick={toggle_modal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span>Comment</span>
    </button>
    <button class="engagement-btn share-btn" onclick={copy_to_clipboard}>
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

{#if show_modal}
    <div 
        class="modal-backdrop" 
        onclick={handle_outside_click}
        onkeydown={handle_backdrop_keydown}
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        transition:fade={{ duration: 200 }}
    >
        <div class="modal-content" transition:scale={{ start: 0.95, duration: 200 }}>
            <div class="modal-header">
                <h2>Add Comment</h2>
                <button class="close-button" onclick={toggle_modal} aria-label="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <textarea id="comment" bind:value={comment_text} rows="5" placeholder="Write your comment here..."required>
                    </textarea>
                </div>
                
                <div class="form-actions">
                    <button 
                        type="button" class="confirm" onclick={submit_comment} 
                        disabled={!comment_text.trim() || is_submitting}
                    >
                        {is_submitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .engagement {
        display: flex;
        gap: 0.75rem;
        margin: 1rem 0;

        flex-wrap: wrap;
    }

    .engagement-btn {
        display: flex;
        align-items: center;
        justify-content: center;

        flex: 1;
        gap: 0.5rem;

        padding: 0.5rem 1rem;
        border-radius: 2rem;
        border: none;

        background: transparent;
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

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        
        width: 100%;
        height: 100%;
        
        background-color: rgba(0, 0, 0, 0.5);
        
        display: flex;
        align-items: center;
        justify-content: center;
        
        z-index: 100;
    }
    
    .modal-content {
        background-color: var(--color-background-secondary);
        border-radius: 1.5rem;
        
        width: 90%;
        
        max-width: 500px;
        max-height: 90vh;
        
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        padding: 1rem;
    }
    
    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
    }
    
    .close-button {
        background: none;
        border: none;
        
        cursor: pointer;
        color: var(--color-text-primary);
        
        padding: 0.25rem;
        border-radius: 0.25rem;
        
        transition: color 0.2s;
    }
    
    .close-button:hover {
        color: var(--color-text-secondary);
    }
    
    .modal-body {
        padding: 1rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        border: none;
        
        color: var(--color-text-secondary);
        background-color: var(--color-background-primary);

        font-family: inherit;
        font-size: 1rem;

        transition: all 0.2s ease;
        box-sizing: border-box;
        resize: none;
    }

    .form-group textarea:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
    
    .form-actions {
        display: flex;
        
        justify-content: flex-end;
        gap: 0.75rem;
        
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    
    button.confirm {
        background-color: var(--color-blue-primary);
        color: white;

        border: none;
        border-radius: 1rem;

        padding: 0.5rem 2rem;
        font-weight: 600;

        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    button.confirm:hover {
        background-color: var(--color-blue-secondary);
    }
    
    button.confirm:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>