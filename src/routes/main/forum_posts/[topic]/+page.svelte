<script lang="ts">
	import { Thumbnail } from '$lib';
    import { fade, scale } from 'svelte/transition';
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

    const { data, form } = $props();
    
    // State for modal visibility
    let showModal = $state(false);
    
    // Toggle modal visibility
    function toggle_modal() {
        showModal = !showModal;
    }
    
    // Close modal when clicking outside
    function handle_outside_click(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('modal-backdrop')) {
            showModal = false;
        }
    }
    
    // Keyboard event handler for modal backdrop
    function handle_backdrop_keydown(event: KeyboardEvent) {
        // Close modal on Escape key
        if (event.key === 'Escape') {
            showModal = false;
        }
    }
</script>

{#each data.posts as post }
    <Thumbnail post_id={post.id} user_liked={post.user_liked} 
    username={post.author_name} topic={post.topic} heading={post.heading} 
    />
{/each}

<div class="post-container">
    <!-- Add button to open modal -->
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
    {#if showModal}
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
                    <button 
                        class="close-button" 
                        onclick={toggle_modal}
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="modal-body">
                    <form use:enhance={( {} ) => {
                        return async ({ result, update }) => {
                            // Redirect to signin
                            if (result.type === "failure") {
                                goto('/login/signin');
                            }
    
                            await update();
                        };
                    }} method="POST" action="?/create">
                        <div class="form-group">
                            <label for="heading">Heading</label>
                            <input type="text" id="heading" name="heading" required>
                        </div>

                        <div class="form-group">
                            <label for="topic">Topic</label>
                            <select id="topic" name="topic" required>
                                <option value="" disabled selected>Select a topic</option>
                                <option value="Art">Art</option>
                                <option value="Philosophy">Philosophy</option>
                                <option value="Nature">Nature</option>
                                <option value="Science">Science</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="content">Content</label>
                            <textarea id="content" name="content" rows="5" required></textarea>
                        </div>

                        <!-- <div class="form-group">
                            <label for="image">Image</label>
                            <input type="file" id="image" name="image">
                        </div> -->
                        
                        <div class="form-actions">
                            <button 
                                type="button" 
                                class="cancel" 
                                onclick={toggle_modal}
                            >
                                Cancel
                            </button>
                            <button type="submit" class="confirm">Create Post</button>
                        </div>
                    </form>
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
    }
    
    .add-button:hover {
        transform: scale(1.075);
        background-color: var(--color-blue-secondary)
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
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
    }
    
    .form-group input,
    .form-group textarea {
        width: 95%;
        padding: 0.25rem 0.75rem;
        
        color: var(--color-text-secondary);
        background-color: var(--color-background-primary);
        
        border-radius: 0.25rem;
        border-color: var(--color-blue-secondary);
        
        font-family: inherit;
        font-size: 1rem;
    }

        .form-group select {
        width: 100%;
        padding: 0.5rem 0.75rem;
        color: var(--color-text-secondary);
        background-color: var(--color-background-primary);
        border-radius: 0.25rem;
        border-color: var(--color-blue-secondary);
        font-family: inherit;
        font-size: 1rem;
        cursor: pointer;
    }

    .form-group select:focus {
        outline: none;
        border-color: var(--color-blue-primary);
    }

    .form-group textarea {
        resize: none;
    }

    .form-group 
    
    .form-actions {
        display: flex;
        
        justify-content: flex-end;
        gap: 0.75rem;
        
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    
    button.cancel, button.confirm {
        color: white;

        border: none;
        border-radius: 0.25rem;

        padding: 0.6rem 1.25rem;
        cursor: pointer;

        transition: background-color 0.2s;
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
</style>