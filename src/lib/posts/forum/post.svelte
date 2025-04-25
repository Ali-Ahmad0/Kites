<script lang="ts">
	import { page } from "$app/state";
    import { is_dark_mode } from "$lib";	
    import { Engagement } from "$lib";
    import { Icon } from "$lib";
    import { Tooltip } from "$lib";

    const { 
        post_id, user_liked, pfp,
        heading, username, content, topic,
        comments, image,
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
            await fetch('/api/forum/delete', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ post_id: post_id, author_name: username })
            });
        } catch(e) {
            console.error(e);
        } finally {
            is_deleting = false;
            window.location.href = '/';
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
            <p class="topic">{topic}</p>
            
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
        <Engagement post_id={post_id} user_liked={user_liked}/>
    </div>

    {#each comments as comment_data}
        <div class="comment">
            <div class="comment-wrapper">
                {#if comment_data.author_pfp}
                    <img class="comment-avatar" src={comment_data.author_pfp || "/placeholder.svg"} alt="avatar" />
                {:else}
                    <img class="comment-avatar" src="/profile.jpg" alt="avatar" />
                {/if}
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">{comment_data.author_name}</span>
                    </div>
                    <div class="comment-text">{comment_data.comment}</div>
                </div>
            </div>
        </div>
    {/each}

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

    .pfp {
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

    .right-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .topic {
        color: var(--color-text-primary);
        margin: 0;
        font-weight: 500;
    }

    .post-options {
        position: relative;
    }
    .more {
        background-color: transparent;
        border: none;
        cursor: pointer;
        transition: opacity 0.2s ease;
    }

    .more:hover {
        opacity: 0.7;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 10;
        
        min-width: 160px;
        
        margin-top: 0.5rem;
        padding: 0.5rem;
        
        background-color: var(--color-background-primary);
        
        border: 1px solid var(--color-navigation-border);
        border-radius: 0.75rem;
        
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        width: 100%;
        
        padding: 0.75rem;
        
        font-size: 0.95rem;
        font-weight: 500;
        
        background-color: transparent;
        border: none;
        border-radius: 0.5rem;
        
        cursor: pointer;
        
        transition: background-color 0.2s ease;
    }

    .delete-post {
        color: var(--color-red, #e53935);
    }

    .delete-post:hover {
        background-color: rgba(229, 57, 53, 0.1);
    }

    .delete-post svg {
        color: var(--color-red, #e53935);
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

    /* Confirmation dialog styles */
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
        
        background-color: rgba(0, 0, 0, 0.5);
    }

    .confirm-content {
        width: 90%;
        max-width: 400px;
        
        padding: 1.5rem;
        
        background-color: var(--color-background-primary);
        
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .confirm-content h3 {
        margin-top: 0;
        margin-bottom: 0.75rem;
        
        font-size: 1.25rem;
        font-weight: 600;
        
        color: var(--color-red, #e53935);
    }

    .confirm-content p {
        margin-bottom: 1.5rem;
        
        font-size: 0.95rem;
        
        color: var(--color-text-secondary);
    }

    .confirm-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
    }

    .cancel-button, .delete-button {
        padding: 0.65rem 1.25rem;
        
        font-size: 0.95rem;
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
    
    .cancel-button:hover:not(:disabled) {
        border-color: var(--color-blue-primary);
        color: var(--color-blue-primary);
    }

    .delete-button {
        background-color: var(--color-red, #e53935);
        color: white;
        
        border: none;
    }
    
    .delete-button:hover:not(:disabled) {
        background-color: var(--color-red-dark, #c62828);
    }

    .cancel-button:disabled, .delete-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
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