<script lang="ts">
    import { fade, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
    
    // State for modal visibility
    let show_modal = $state(false);

    let heading_text = $state("");
    let content_text = $state("");
    let topic_chosen = $state("");
    let image: File | undefined = $state(undefined);
    let is_creating = $state(false);
    
    // Toggle modal visibility
    function toggle_modal() {
        // Redirect to login if needed
        if (!page.data.authenticated) {
            goto('/login/signin');
        }

        show_modal = !show_modal;
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

    function handle_file_upload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target?.files && target.files.length > 0) {
            image = target.files[0]; 
        } else {
            image = undefined;
        }
    }

    async function create_post() {
        if (!heading_text.trim() || !topic_chosen.trim() || !content_text.trim()) return;

        try {
            is_creating = true;

            const form_data = new FormData();
            form_data.append('heading', heading_text);
            form_data.append('content', content_text);
            form_data.append('topic', topic_chosen);
            form_data.append('type', "Discussion");
            if (image) {
                form_data.append('image', image);
            }

            const response = await fetch('/api/forum/new', {
                method: 'POST',
                body: form_data 
            });
            const data = await response.json();

            if (response.status === 401) {
                goto('/login/signin');
                return;
            }

            if (response.status !== 200) {
                alert(data.error);
            }

            // Reset
            heading_text = "";
            content_text = "";
            topic_chosen = "";
            image = undefined;
            show_modal = false;

            const url = `/main/forum_posts/${data.topic}/${data.post_id}`
            window.location.href = url;

        } catch (e) {
            console.error("[KITES | ERROR] Failed to create new post", e);
        } finally {
            is_creating = false;
        }
    }

</script>

<div class="post-container">
    
    <button 
        class="add-button" 
        onclick={toggle_modal}
        aria-label="Add new post"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    </button>
    
    <!-- Modal backdrop and content -->
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
                    <h2>Create New Post</h2>
                    <button class="close-button" onclick={toggle_modal} aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="form-group">
                        <label for="heading">Heading</label>
                        <input type="text" id="heading" name="heading" bind:value={heading_text} required>
                    </div>

                    <div class="form-group">
                        <label for="topic">Topic</label>
                        <select id="topic" name="topic" bind:value={topic_chosen} required>
                            <option value="" disabled selected>Select a topic</option>
                            <option value="Art">Art</option>
                            <option value="Philosophy">Philosophy</option>
                            <option value="Nature">Nature</option>
                            <option value="Science">Science</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="content">Content</label>
                        <textarea id="content" name="content" rows="5" bind:value={content_text} required>
                        </textarea>
                    </div>

                    <div class="form-group">
                        <label for="image">Image</label>
                        <input type="file" id="image" name="image" onchange={handle_file_upload} accept="image/*">
                        <span class="file-hint">{image ? `Selected: ${image.name}` : 'No file selected'}</span>
                    </div>

                    
                    <div class="form-actions">
                        <button type="button" class="cancel" onclick={toggle_modal}>
                            Cancel
                        </button>
                        <button type="button" class="confirm" onclick={create_post}
                        disabled={!heading_text.trim() || !topic_chosen.trim() || !content_text.trim() || is_creating}>
                        {is_creating ? 'Creating...' : 'Create Post'}
                    </button>
                </div>                    
                <div class="blog-link-container">
                    <div class="divider">
                        <span>or</span>
                    </div>
                    <a href="/main/forum_posts/create_blog" class="create-blog-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <button onclick={() => show_modal = false}> 
                            Create a blog post instead
                        </button>
                    </a>
                </div>
            </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .post-container {
        position: relative;
    }
    
    .add-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background-color: var(--color-blue-primary);
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 50;
    }
    
    .add-button:hover {
        transform: scale(1.075);
        background-color: var(--color-blue-secondary);
    }
    
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        backdrop-filter: blur(2px);
    }
    
    .modal-content {
        background-color: var(--color-background-secondary);
        border-radius: 1.5rem;
        width: 90%;
        max-width: 550px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-text-primary);
    }
    
    .close-button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text-primary);
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: color 0.2s, background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .close-button:hover {
        color: var(--color-text-secondary);
        background-color: rgba(0, 0, 0, 0.05);
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .form-group {
        margin-bottom: 1.25rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--color-text-primary);
    }
    
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        color: var(--color-text-secondary);
        background-color: var(--color-background-primary);
        border-radius: 0.5rem;
        border: 1.5px solid var(--color-blue-secondary);
        font-family: inherit;
        font-size: 1rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--color-blue-primary);
        box-shadow: 0 0 0 3px rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.2);
    }

    .form-group select {
        width: 100%;
        padding: 0.75rem 1rem;
        color: var(--color-text-secondary);
        background-color: var(--color-background-primary);
        border-radius: 0.5rem;
        border: 1.5px solid var(--color-blue-secondary);
        font-family: inherit;
        font-size: 1rem;
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1em;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-group textarea {
        resize: vertical;
        min-height: 120px;
    }
    
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    button.cancel, button.confirm {
        color: white;
        border: none;
        border-radius: 0.5rem;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        font-weight: 500;
        font-size: 1rem;
        transition: background-color 0.2s, transform 0.1s;
    }

    button.cancel {
        background-color: var(--color-red-primary);
    }

    button.confirm {
        background-color: var(--color-blue-primary);
    }

    button.cancel:hover {
        background-color: var(--color-red-secondary);
    }
      
    button.confirm:hover {
        background-color: var(--color-blue-secondary);
    }

    button.cancel:active,
    button.confirm:active {
        transform: translateY(1px);
    }
    
    button.confirm:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .blog-link-container {
        margin: 2rem 0;
        text-align: center;
    }

    .divider {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }

    .divider::before,
    .divider::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid var(--color-navigation-border);
    }

    .divider span {
        padding: 0 1rem;
        color: var(--color-text-secondary);
        font-size: 0.9rem;
    }
    
    .create-blog-link, .create-blog-link button {
        text-decoration: none;

        color: var(--color-blue-primary);
        border-color: transparent;
        background-color: transparent;

        font-size: 1rem;
         
        transition: color 0.2s ease;
    }

    .create-blog-link:hover, .create-blog-link button:hover {
        color: var(--color-blue-secondary);
    }

    .form-group input[type="file"] {
        width: 100%;
        padding: 0.5rem;
        border: 1.5px dashed var(--color-blue-secondary);
        background-color: rgba(0, 0, 0, 0.03);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s;
    }

    .form-group input[type="file"]:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-color: var(--color-blue-primary);
    }

    .form-group input[type="file"]:focus {
        outline: none;
        border-color: var(--color-blue-primary);
        box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
    }

    .file-hint {
        display: block;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
        .modal-header h2 {
            font-size: 1.25rem;
        }

        .form-actions {
            flex-direction: column-reverse;
            gap: 0.75rem;
        }

        button.cancel, button.confirm {
            width: 100%;
        }
    }
</style>
