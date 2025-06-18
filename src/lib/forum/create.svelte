<script lang="ts">
    import { fade, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
    
    // character limit configuration based on user type
    type RankType = 'default' | 'Bronze' | 'Silver' | 'Gold' | 'Admin';
    
    const character_limits: Record<RankType, number> = {
        'default': 280,
        'Bronze': 500,
        'Silver': 750,
        'Gold': 1000,
        'Admin': Infinity
    };

    // Get user rank
    let user_rank = page.data.rank;

    // Now validate the rank
    let rank: RankType = Object.keys(character_limits).includes(user_rank) ? user_rank as RankType : 'default';

    // Define character limit reactively
    let character_limit = character_limits[rank];

    // State for modal visibility
    let show_modal = $state(false);
    
    let heading_text = $state("");
    let content_text = $state("");
    let topic_chosen = $state("");
    let image: File | undefined = $state(undefined);

    let is_creating = $state(false);
    let is_over_limit = $state(false);
    let character_count = $state(0);
    let heading_too_large = $state(false);
    let character_count_heading = $state(0);

    // Calculate character count and check if over limit
    $effect(() => {
        calculate_character_count();
    });
    
    function calculate_character_count() {
        // Calculate characters without spaces
        character_count = content_text.replace(/\s/g, '').length;
        
        // Check if over character limit
        is_over_limit = character_count > character_limit;

        character_count_heading = heading_text.replace(/\s/g, '').length;

        // Check if heading is too large
        heading_too_large = character_count_heading > 64;
    }

    // Toggle modal visibility
    function toggle_modal() {
        // Reset stuff
        heading_text = ""
        content_text = ""
        topic_chosen = ""
        image = undefined
    
        if (!page.data.authenticated) {
            goto('/login/signin');
            return;
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

        // Check if over the character limit
        if (is_over_limit || heading_too_large) return;

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

<div class="container">
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
                    <button class="close-button" onclick={toggle_modal} aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <h2>Create a post</h2>
                </div>
                
                <div class="modal-body">
                    <div class="form-group">
                        <input 
                            type="text" 
                            id="heading" 
                            name="heading" 
                            bind:value={heading_text} 
                            placeholder="Add a title..."
                            required
                        >
                        {#if heading_too_large}
                            <div class="error-message">
                                Title too long ({character_count_heading}/70 characters)
                            </div>
                        {/if}
                    </div>

                    <div class="form-group">
                        <textarea 
                            id="content" 
                            name="content" 
                            rows="4" 
                            bind:value={content_text} 
                            placeholder="Add a description..."
                            required
                        ></textarea>
                        <div class="character-count-container">
                            <span class={is_over_limit ? "character-count over-limit" : "character-count"}>
                                {character_count}/{character_limit}
                                {#if is_over_limit}
                                    <span class="limit-warning">exceeds {rank} limit</span>
                                {/if}
                            </span>
                        </div>
                    </div>

                    <div class="form-group">
                        <select id="topic" name="topic" bind:value={topic_chosen} required>
                            <option value="" disabled selected>Select a topic</option>
                            <option value="Art">Art</option>
                            <option value="Philosophy">Philosophy</option>
                            <option value="Nature">Nature</option>
                            <option value="Science">Science</option>
                        </select>
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

                    <div class="bottom-section">
                        <div class="media-options">
                            <label for="image" class="media-button" title="Add image">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21,15 16,10 5,21"/>
                                </svg>
                                <input type="file" id="image" name="image" onchange={handle_file_upload} accept="image/*" style="display: none;">
                            </label>
                            <span>Add image</span>
                        </div>
                        <button 
                            type="button" 
                            class="post-button" 
                            onclick={create_post}
                            disabled={!heading_text.trim() || !topic_chosen.trim() || !content_text.trim() || is_creating || is_over_limit || heading_too_large}
                            aria-label="Create post"
                        >
                        {is_creating ? 'Posting...' : 'Post'}
                    </button>
                    </div>

                    {#if image}
                        <div class="file-preview">
                            <span>{image.name}</span>
                            <button onclick={() => image = undefined} class="remove-file">×</button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<style> 
    .container {
        min-height: 100vh;
        padding: 2rem;
    }
    
    .add-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        
        width: 56px;
        height: 56px;
        border-radius: 50%;
        
        background-color: var(--color-blue-primary);
        color: white;
        
        border: none;
        
        display: flex;
        align-items: center;
        justify-content: center;
        
        cursor: pointer;
        
        transition: all 0.2s ease;
        z-index: 50;
    }
    
    .add-button:hover {
        transform: scale(1.1);
        background-color: var(--color-blue-secondary);
    }
    
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        
        width: 100%;
        height: 100%;
        
        display: flex;
        align-items: center;
        justify-content: center;
        
        z-index: 100;
        
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }
    
    .modal-content {
        background-color: var(--color-background-secondary);
        border-radius: 16px;
        
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        
        overflow: hidden;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        
        align-items: center;
        padding: 1rem 1.25rem;

        background-color: var(--color-background-secondary);
    }
    
    .modal-header h2 {
        margin: 0;
        margin-right: 1rem;

        color: var(--color-text-primary);
        flex: 1;
        text-align: center;
    }
    
    .close-button {
        background: none;
        border: none;
        cursor: pointer;
        
        color: #999;
        
        padding: 0.5rem;
        border-radius: 0.5rem;

        transition: all 0.2s ease;
        
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .close-button:hover {
        color: #666;
    }
    
    .post-button {
        background-color: var(--color-blue-primary);
        color: white;

        border: none;
        border-radius: 1rem;

        padding: 0.5rem 1rem;
        font-weight: 600;

        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .post-button:hover:not(:disabled) {
        background-color: var(--color-blue-secondary);
    }
    
    .post-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .modal-body {
        padding: 1.25rem;
        overflow-y: auto;
        max-height: calc(90vh - 80px);
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
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
    
    .form-group input::placeholder,
    .form-group textarea::placeholder {
        color: var(--color-navigation-border);
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
    
    .form-group select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 1rem;
        padding-right: 3rem;
    }
    
    .form-group textarea {
        min-height: 100px;
        font-family: inherit;
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
    
    .bottom-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-navigation-border);
    }
    
    .media-options {
        display: flex;
    }
    
    .media-button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-blue-primary);
        
        padding: 0;
        margin: 0.5rem;
        
        transform: scale(1.1);

        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .media-button:hover:not(:disabled) {
        color: var(--color-blue-secondary);
    }

    .media-options span {
        margin-top: 0.55rem;
        margin-left: 0.2rem;
    }

    span {
        font-size: 0.75rem;
        color: var(--color-text-secondary);

        font-weight: bold;
    }

    .media-button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .character-count-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
    }
    
    .character-count {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
    }
    
    .over-limit {
        color: var(--color-red-primary);
        font-weight: 500;
    }
    
    .limit-warning {
        font-style: italic;
        margin-left: 0.25rem;
    }

    .error-message {
        color: var(--color-red-primary);
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }

    .file-preview {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        background-color: var(--color-background-primary);
        
        padding: 0.5rem 0.75rem;
        margin-top: 0.75rem;
        border-radius: 0.5rem;
        
        font-size: 0.8rem;
    }

    .remove-file {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .remove-file:hover {
        color: var(--color-red-primary);
    }

    @media (max-width: 640px) {
        .modal-content {
            width: 95%;
            margin: 0.7rem;
        }

        .bottom-section {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }
    }
</style>
