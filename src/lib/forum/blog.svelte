<script lang="ts">
    import { page } from "$app/state";
    import { Engagement, Icon, Tooltip, ForumComment, is_dark_mode } from "$lib";	
    import { marked } from 'marked';
    import sanitizeHtml from 'sanitize-html';
	import { onDestroy, onMount } from "svelte";

    const { 
        post_id, user_liked, pfp,
        heading, username, content, topic,
        comments, image, type, user_id
    } = $props();

    let is_deleting : boolean = $state(false);
    let show_dropdown: boolean = $state(false);
    let show_confirm: boolean = $state(false);
    let safe_html: string = $state("");

    async function process_markdown() {
        const html = await marked(content); 
        safe_html = sanitizeHtml(html); // Sanitize the resolved HTML
    }
    
    process_markdown();

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
            const response = await fetch('/api/forum/delete', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ post_id: post_id, author_name: username, type: type, user_id: user_id })
            });

            if(response.status === 200) {
                window.location.href = '/';
            } else {
                const data = await response.json();
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

        // Comment pagination logic
    let comments_data = $state(comments);
    let current_page = $state(1);

    let is_loading = $state(false);
    let has_more_comments = $state(true);

    async function load_more_comments() {
        if (is_loading || !has_more_comments)
            return;

        try {
            is_loading = true;
            current_page++;

            const response = await fetch(`/api/forum/comment/load?page=${current_page}&post_id=${post_id}`);
            const new_data = await response.json();

            if (new_data.comments_data && new_data.comments_data.length > 0) {
                // Append new comments to existing ones
                comments_data = [...comments_data, ...new_data.comments_data];   
            } else {
                has_more_comments = false;
            }
        } catch (e) {
            console.error('[KITES | ERROR]: Error loading more comments: ', e);
        } finally {
            is_loading = false;
        }
    }

    let observer: IntersectionObserver | null;
    let sentinel: HTMLDivElement;
        
    onMount(() => {
        observer = new IntersectionObserver((entries) => {
            // Load when reaching end of page
            if (entries[0].isIntersecting && !is_loading) {
                load_more_comments();
            }
        }, {
            rootMargin: '100px'
        });
        
        if (sentinel) {
            observer.observe(sentinel);
        }
    });
    
    onDestroy(() => {
        if (observer && sentinel) {
            observer.unobserve(sentinel);
            observer = null;
        }
    });
</script>

<svelte:window on:click={handle_click_outside} />

<article class="blog-container">
    <header class="blog-header">
        <div class="blog-meta">
            <div class="blog-topic">{topic} | {type} </div>
        </div>
        
        <h1 class="blog-title">{heading}</h1>
        
        <div class="blog-author-container">
            <div class="blog-author">
                {#if pfp}
                    <img src={pfp || "/placeholder.svg"} alt="{username}'s profile" class="blog-author-image">
                {:else}
                    <img class="blog-author-image" src="/profile.jpg" alt="{username}'s profile">
                {/if}
                <div class="blog-author-info">
                    <p class="blog-author-name">{username}</p>
                </div>
            </div>  
            
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
    </header>
    
    {#if image}
        <div class="blog-featured-image-container">
            <img src={image || "/placeholder.svg"} alt="Featured image for {heading}" class="blog-featured-image">
        </div>
    {/if}
    
    <div class="blog-content">
        {@html safe_html}
    </div>
    
    <div class="blog-engagement">
        <Engagement post_id={post_id} topic={topic} user_liked={user_liked}/>
    </div>
    
    <div class="blog-comments-section">
        <h2 class="blog-comments-title">Comments</h2>
        {#if comments_data.length > 0}
            <div class="blog-comments">
                {#each comments_data as comment_data (comment_data.id)}
                    <ForumComment comment_data={comment_data}/>
                {/each}
            </div>
        {:else}
            <p class="blog-no-comments">No comments yet. Be the first to share your thoughts!</p>
        {/if}

        <div bind:this={sentinel}></div>
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
</article>

<style>
    .blog-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1.5rem;
        color: var(--color-text-primary);
    }

    .blog-header {
        margin-bottom: 2rem;
    }

    .blog-meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }

    .blog-topic {
        background-color: var(--color-background-secondary, #f5f5f5);
        color: var(--color-text-secondary);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-weight: 500;
    }

    .blog-title {
        font-size: 2.5rem;
        line-height: 1.2;
        margin: 0 0 1.5rem 0;
        font-weight: 800;
    }

    .blog-author-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .blog-author {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .blog-author-image {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--color-blue-primary, #3b82f6);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .blog-author-info {
        display: flex;
        flex-direction: column;
    }

    .blog-author-name {
        margin: 0;
        font-weight: 600;
        font-size: 1.1rem;
    }

    .blog-featured-image-container {
        margin: 2rem 0;
        border-radius: 1rem;
        overflow: hidden;
    }

    .blog-featured-image {
        width: 100%;
        max-height: 500px;
        object-fit: cover;
    }

    .blog-content {
        font-size: 1.1rem;
        line-height: 1.8;
        margin-bottom: 3rem;
    }

    /* Style markdown content */
    .blog-content :global(h1) {
        font-size: 2rem;
        margin: 2rem 0 1rem;
    }

    .blog-content :global(h2) {
        font-size: 1.75rem;
        margin: 1.75rem 0 1rem;
    }

    .blog-content :global(h3) {
        font-size: 1.5rem;
        margin: 1.5rem 0 1rem;
    }

    .blog-content :global(p) {
        margin: 1.25rem 0;
    }

    .blog-content :global(ul), .blog-content :global(ol) {
        margin: 1.25rem 0;
        padding-left: 2rem;
    }

    .blog-content :global(li) {
        margin: 0.5rem 0;
    }

    .blog-content :global(blockquote) {
        border-left: 4px solid var(--color-blue-primary, #3b82f6);
        padding-left: 1rem;
        margin: 1.5rem 0;
        font-style: italic;
        color: var(--color-text-secondary);
    }

    .blog-content :global(pre) {
        background-color: var(--color-background-secondary, #f5f5f5);
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1.5rem 0;
    }

    .blog-content :global(code) {
        font-family: monospace;
        background-color: var(--color-background-secondary, #f5f5f5);
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-size: 0.9em;
    }

    .blog-content :global(pre code) {
        background-color: transparent;
        padding: 0;
    }

    .blog-content :global(img) {
        max-width: 100%;
        border-radius: 0.5rem;
        margin: 1.5rem 0;
    }

    .blog-content :global(a) {
        color: var(--color-blue-primary, #3b82f6);
        text-decoration: none;
    }

    .blog-content :global(a:hover) {
        text-decoration: underline;
    }

    .blog-content :global(hr) {
        border: none;
        border-top: 1px solid var(--color-navigation-border);
        margin: 2rem 0;
    }

    .blog-engagement {
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--color-navigation-border);
    }

    .blog-comments-section {
        margin-top: 2rem;
    }

    .blog-comments-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .blog-comments {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .blog-no-comments {
        color: var(--color-text-secondary);
        font-style: italic;
    }

    /* Dropdown and confirmation dialog styles */
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
        color: var(--color-red-secondary);
    }

    .delete-post:hover {
        background-color: rgba(229, 57, 53, 0.1);
    }

    .delete-post svg {
        color: var(--color-red-secondary);
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
        color: var(--color-red-secondary);
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
    
    .cancel-button:hover {
        border-color: var(--color-blue-primary);
        color: var(--color-blue-primary);
    }

    .delete-button {
        background-color: var(--color-red-secondary);
        color: white;
        border: none;
    }
    
    .delete-button:hover {
        background-color: var(--color-red-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(229, 57, 53, 0.4);
    }

    .cancel-button:disabled, .delete-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .blog-container {
            padding: 1.5rem 1rem;
        }
        
        .blog-title {
            font-size: 2rem;
        }
        
        .blog-content {
            font-size: 1rem;
        }
        
        .blog-featured-image {
            max-height: 350px;
        }
    }
    
    @media (max-width: 480px) {
        .blog-container {
            padding: 1rem 0.75rem;
        }
        
        .blog-title {
            font-size: 1.75rem;
        }
        
        .blog-author-image {
            width: 3rem;
            height: 3rem;
        }
    }
</style>