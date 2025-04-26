<script lang="ts">
	import { page } from "$app/state";
    import { is_dark_mode } from "$lib";
    import { Icon } from "$lib"
    import { Tooltip } from "$lib";

    let { comment_data } = $props();
    
    let show_dropdown: boolean = $state(false);
    let show_confirm: boolean = $state(false);
    let is_deleting: boolean = $state(false);
    
    // Dynamic icon folder based on dark mode
    let folder: string = $state("dark_mode_icons");
  
    // Update folder on dark mode change
    $effect(() => {
        folder = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    });
    
    function toggle_dropdown() {
        show_dropdown = !show_dropdown;
    }
    
    function ask_delete_confirmation() {
        show_dropdown = false;
        show_confirm = true;
    }
    
    function cancel_delete() {
        show_confirm = false;
    }
    
    // delete the comment
    async function delete_comment() {
        try {
            is_deleting = true;
            await fetch('/api/forum/comment/delete', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment_id: comment_data.id, author_name: comment_data.author_name })
            });
            
        } catch (e) {
            console.error('[KITES | ERROR]: ', e);
        } finally {
            is_deleting = false;
            show_confirm = false;

            window.location.reload();
        }
    }
</script>

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
                {#if page.data.authenticated && comment_data.author_name === page.data.user?.username}
                    <div class="comment-options">
                        <Tooltip text="More">
                            <button class="more" onclick={toggle_dropdown}>
                                <Icon mode={folder} name="more_h" width=24 height=24 alt="more" />
                            </button>
                        </Tooltip>
                        
                        {#if show_dropdown}
                            <div class="dropdown-menu">
                                <button class="dropdown-item delete-comment" onclick={ask_delete_confirmation}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
            <div class="comment-text">{comment_data.comment}</div>
        </div>
    </div>
</div>

{#if show_confirm}
    <div class="confirm-dialog">
        <div class="confirm-content">
            <h3>Delete Comment?</h3>
            <p>This action cannot be undone. Your comment will be permanently deleted.</p>
            <div class="confirm-buttons">
                <button class="cancel-button" onclick={cancel_delete} disabled={is_deleting}>
                    Cancel
                </button>
                <button class="delete-button" onclick={delete_comment} disabled={is_deleting}>
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

<style>
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
    
    .comment-options {
        position: relative;
        margin-left: auto;
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
        
        min-width: 120px;
        
        margin-top: 0.25rem;
        padding: 0.25rem;
        
        background-color: var(--color-background-primary);
        
        border: 1px solid var(--color-navigation-border);
        border-radius: 0.5rem;
        
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        width: 100%;
        
        padding: 0.5rem;
        
        font-size: 0.85rem;
        font-weight: 500;
        
        background-color: transparent;
        border: none;
        border-radius: 0.25rem;
        
        cursor: pointer;
        
        transition: background-color 0.2s ease;
    }

    .delete-comment {
        color: var(--color-red, #e53935);
    }

    .delete-comment:hover {
        background-color: rgba(229, 57, 53, 0.1);
    }

    .delete-comment svg {
        color: var(--color-red, #e53935);
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
        padding: 0.5rem 1rem;
        
        font-size: 0.9rem;
        font-weight: 500;
        
        border-radius: 0.5rem;
        
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
</style>