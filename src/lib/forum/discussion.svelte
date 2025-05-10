<script lang="ts">
	import { page } from "$app/state";
    import { Icon, Tooltip, Engagement, ForumComment, is_dark_mode } from "$lib";	

    const { 
        post_id, user_liked, pfp,
        heading, username, content, topic,
        comments, image, type, user_id
    } = $props();

    let is_deleting : boolean = $state(false);
    let show_dropdown: boolean = $state(false);
    let show_confirm: boolean = $state(false);

    // Dynamic icon folder based on dark mode
    let folder: string = $state("dark_mode_icons");
  
    // Update folder on dark mode change
    $effect(() => {
        folder = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    });

    // delete the post and all related data
    async function delete_post() {
        try {
            is_deleting = true;
            const resp = await fetch('/api/forum/delete', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ post_id: post_id, author_name: username, type: type, user_id: user_id })
            });

            if(resp.status === 200) {
                window.location.href = '/';
            } else {
                const data = await resp.json();
                alert(data.error);
            }

        } catch(e) {
            console.error(e);
        } finally {
            is_deleting = false;
        }
    }

    function ask_delete_confirmation() {
        show_dropdown = false;
        show_confirm = true;
    }

    function cancel_delete() {
        show_confirm = false;
    }

    function toggle_dropdown() {
        show_dropdown = !show_dropdown;
    }

    // Close dropdown when clicking outside
    function handle_click_outside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.post-options') && !target.closest('.confirm-dialog')) {
            show_dropdown = false;
        }
    }
</script>

<svelte:window on:click={handle_click_outside} />

<div class="container">
    <div class="details">
        <div class="author">
            {#if pfp}
                <img src={pfp || "/placeholder.svg"} alt="pfp" class="pfp">
            {:else}
                <img class="pfp" src="/profile.jpg" alt="pfp">
            {/if}
            <p class="user-name">{username}</p>
        </div>   
        <div class="right-section">
            <p class="topic">{topic} | {type}</p>
            
            {#if page.data.authenticated && page.data.user?.username === username}
                <div class="post-options">
                    <Tooltip text="More">
                        <button class="more" onclick={toggle_dropdown}>
                            <Icon mode={folder} name="more_v" width=24 height=24 alt="more" />
                        </button>
                    </Tooltip>
                    
                    {#if show_dropdown}
                        <div class="dropdown-menu">
                            <button class="dropdown-item delete-post" onclick={ask_delete_confirmation}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Delete Post
                            </button>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
    
    <div class="post">
        <h1 class="title">{heading}</h1>
        
        <p class="content">
            {content}
        </p>
        {#if image}
            <img src={image || "/placeholder.svg"} alt="" class="post-image">
        {/if}

        <Engagement post_id={post_id} topic={topic} user_liked={user_liked}/>
    </div>

    <div class="comments-section">
        <h2 class="comments-title">Comments</h2>
        {#if comments.length > 0}
            <div class="comments">
                {#each comments as comment_data (comment_data.id)}
                    <ForumComment comment_data={comment_data}/>
                    
                {/each}
            </div>
        {:else}
            <p class="no-comments">No comments yet. Be the first to share your thoughts!</p>
        {/if}
    </div>

    {#if show_confirm}
        <div class="confirm-dialog">
            <div class="confirm-content">
                <h3>Delete Post?</h3>
                <p>This action cannot be undone. Your post and all comments will be permanently deleted.</p>
                <div class="confirm-buttons">
                    <button class="cancel-button" onclick={cancel_delete} disabled={is_deleting}>
                        Cancel
                    </button>
                    <button class="delete-button" onclick={delete_post} disabled={is_deleting}>
                        {#if is_deleting}
                            Deleting...
                        {:else}
                            Delete
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        max-width: 1000px;
        margin: 0 auto;
        padding: 1.5rem;
        background-color: var(--color-background-primary);
        border-radius: 1rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-navigation-border);
    }

    .author {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .pfp {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--color-blue-primary, #3b82f6);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .user-name {
        color: var(--color-text-primary);
        margin: 0;
        font-weight: 600;
        font-size: 1.1rem;
    }

    .right-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .topic {
        background-color: var(--color-background-secondary, #f5f5f5);
        color: var(--color-text-secondary);
        padding: 0.35rem 1rem;
        border-radius: 2rem;
        font-weight: 500;
        font-size: 0.9rem;
        letter-spacing: 0.02em;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .post-options {
        position: relative;
    }
    
    .more {
        background-color: transparent;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0.5rem;
        border-radius: 50%;
    }

    .more:hover {
        background-color: var(--color-background-secondary, #f5f5f5);
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 10;
        min-width: 180px;
        margin-top: 0.5rem;
        padding: 0.5rem;
        background-color: var(--color-background-primary);
        border: 1px solid var(--color-navigation-border);
        border-radius: 0.75rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 0.95rem;
        font-weight: 500;
        background-color: transparent;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .delete-post {
        color: var(--color-red-secondary);
    }

    .delete-post:hover {
        background-color: rgba(229, 57, 53, 0.1);
        transform: translateX(2px);
    }

    .delete-post svg {
        color: var(--color-red-secondary);
    }

    .post {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding-bottom: 2rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--color-navigation-border);
    }

    .title {
        color: var(--color-text-primary);
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        line-height: 1.3;
        letter-spacing: -0.01em;
    }

    .content {
        color: var(--color-text-primary);
        line-height: 1.7;
        margin: 0;
        font-size: 1.05rem;
        white-space: pre-line;
    }

    .post-image {
        width: 100%;
        max-width: 800px;
        border-radius: 1rem;
        align-self: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    .post-image:hover {
        transform: scale(1.01);
    }

    .comments-section {
        margin-top: 2rem;
    }

    .comments-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .comments {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .no-comments {
        color: var(--color-text-secondary);
        font-style: italic;
    }

    .confirm-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        animation: fadeIn 0.3s ease;
    }

    .confirm-content {
        width: 90%;
        max-width: 420px;
        padding: 2rem;
        background-color: var(--color-background-primary);
        border-radius: 1.25rem;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        animation: scaleIn 0.3s ease;
    }

    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }

    .confirm-content h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--color-red, #e53935);
    }

    .confirm-content p {
        margin-bottom: 2rem;
        font-size: 1rem;
        line-height: 1.6;
        color: var(--color-text-secondary);
    }

    .confirm-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    .cancel-button, .delete-button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .cancel-button {
        background-color: transparent;
        color: var(--color-text-primary);
        border: 1px solid var(--color-navigation-border);
    }
    
    .cancel-button:hover {
        border-color: var(--color-blue-primary, #3b82f6);
        color: var(--color-blue-primary, #3b82f6);
        transform: translateY(-2px);
    }

    .delete-button {
        background-color: var(--color-red-secondary);
        color: white;
        border: none;
        box-shadow: 0 2px 8px rgba(229, 57, 53, 0.3);
    }
    
    .delete-button:hover {
        background-color: var(--color-red-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(229, 57, 53, 0.4);
    }

    .cancel-button:disabled, .delete-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .container {
            padding: 1rem;
            border-radius: 0.75rem;
        }
        
        .title {
            font-size: 1.5rem;
        }
        
        .post-image {
            max-height: 350px;
        }
        
        .confirm-content {
            padding: 1.5rem;
        }
    }
    
    @media (max-width: 480px) {
        .details {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .right-section {
            width: 100%;
            justify-content: space-between;
        }
        
        .confirm-buttons {
            flex-direction: column;
        }
        
        .cancel-button, .delete-button {
            width: 100%;
            text-align: center;
        }
    }
</style>