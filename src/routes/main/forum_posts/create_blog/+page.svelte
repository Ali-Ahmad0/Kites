<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

   // character limit configuration based on user type
   type RankType = 'default' | 'Bronze' | 'Silver' | 'Gold' | 'Admin';
    
    const character_limits: Record<RankType, number> = {
        'default': 1200,
        'Bronze': 2000,
        'Silver': 3500,
        'Gold': 5000,
        'Admin': Infinity
    };

    // Get user rank
    let user_rank = page.data.rank;

    // Now validate the rank
    let rank: RankType = Object.keys(character_limits).includes(user_rank) ? user_rank as RankType : 'default';

    // Define character limit reactively
    let character_limit = character_limits[rank];
      
    let heading_text = $state("");
    let content_text = $state("");
    let topic_chosen = $state("");

    let image: File | undefined = $state(undefined);
    let is_drag_over = $state(false);

    let is_creating = $state(false);
    
    let is_over_limit = $state(false);
    let heading_too_large = $state(false);
    
    let character_count = $state(0);
    let character_count_heading = $state(0);

    // Calculate character count and check if over limit
    $effect(() => {
        calcualte_character_count();
    });
    
    // Calculate character count
    function calcualte_character_count() {
        // Calculate characters without spaces
        character_count = content_text.replace(/\s/g, '').length;
        
        // Check if over character limit
        is_over_limit = character_count > character_limit;

        character_count_heading = heading_text.replace(/\s/g, '').length;

        // Check if heading is too large
        heading_too_large = character_count_heading > 70;
    
    }

    // Image uploading logic
    function handle_file_upload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target?.files && target.files.length > 0) {
            image = target.files[0]; 
        } else {
            image = undefined;
        }
    }

    function handle_file_drop(event: DragEvent) {
        event.preventDefault();
        is_drag_over = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0 && files[0].type.startsWith('image/')) {
            image = files[0];
        }
    }

    function handle_drag_over(event: DragEvent) {
        event.preventDefault();
        is_drag_over = true;
    }

    function handle_drag_leave(event: DragEvent) {
        event.preventDefault();
        is_drag_over = false;
    }

    function remove_image() {
        image = undefined;
    }

    async function create_blogpost() {
        if (!heading_text.trim() || !topic_chosen.trim() || !content_text.trim()) return;

        // Check if over the character limit
        if (is_over_limit || heading_too_large) return;

        try {
            is_creating = true;

            const form_data = new FormData();
            form_data.append('heading', heading_text);
            form_data.append('content', content_text);
            form_data.append('topic', topic_chosen);
            form_data.append('type', "Blog");

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

            const url = `/main/forum_posts/${data.topic}/${data.post_id}`;
            window.location.href = url;

        } catch (e) {
            console.error("[KITES | ERROR] Failed to create new blog post", e);
        } finally {
            is_creating = false;
        }
    }
</script>

<svelte:head>
    <title>Create a Blog Post</title>
</svelte:head>

<div class="content">
    <h1>Create a blog post</h1>
    <div class="form-group">
        <input type="text" id="heading" name="heading" placeholder="Heading" bind:value={heading_text} required>
    </div>
    
    <div class="form-group">
        <textarea id="content" name="content" placeholder="Start writing here..." rows="10" bind:value={content_text} required></textarea>
        <div class="character-count-container">
            <span class={is_over_limit ? "character-count over-limit" : "character-count"}>
                {character_count} / {character_limit} characters
                {#if is_over_limit}
                <span class="limit-warning">(exceeds {rank} user limit)</span>
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
    
    <!-- <div class="form-group">
        <label for="image">Image</label>
        <input type="file" id="image" name="image" onchange={handle_file_upload} accept="image/*" required>
        <span class="file-hint">{image ? `Selected: ${image.name}` : 'No file selected'}</span>
    </div> -->

    <div class="form-group">
        <label for="image">Image</label>
        <div class="image-upload-container">
            <div 
                class="image-upload-area {is_drag_over ? 'drag-over' : ''} {image ? 'has-image' : ''}"
                ondrop={handle_file_drop}
                ondragover={handle_drag_over}
                ondragleave={handle_drag_leave}
                role="button"
                tabindex="0"
                aria-label="Drop your image here or click to browse files"
            >
                {#if image}
                    <div class="image-preview">
                        <div class="image-info">
                            <div class="image-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7,10 12,15 17,10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </div>
                            <div class="image-details">
                                <span class="image-name">{image.name}</span>
                                <span class="image-size">{(image.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        </div>
                        <button type="button" class="remove-image" onclick={remove_image} aria-label="Remove image">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                {:else}
                    <div class="upload-prompt">
                        <svg class="upload-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7,10 12,15 17,10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <div class="upload-text">
                            <span class="upload-primary">Drop your image here</span>
                            <span class="upload-secondary">or click to browse images</span>
                        </div>
                    </div>
                {/if}
                <input 
                    type="file" 
                    id="image" 
                    name="image" 
                    onchange={handle_file_upload} 
                    accept="image/*" 
                    class="file-input"
                    required
                >
            </div>
        </div>
    </div>
    

    <div class="form-actions">
        <button type="button" class="confirm" onclick={create_blogpost}
            disabled={!heading_text.trim() || !topic_chosen.trim() || !content_text.trim() || is_creating || is_over_limit || heading_too_large}>
            {is_creating ? 'Posting...' : 'Post'}
        </button>
    </div>
</div>


<style>
    .content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        
        max-width: 1000px;
        height: fit-content;

        margin: auto;
        padding-bottom: 2rem;
        
        border-bottom: 1px solid var(--color-navigation-border);
    }

    h1 {
        margin: 0;
        font-size: 2.5rem;
    }
    
    #heading {
        font-size: 2rem;
        padding: 1.5rem 1rem;
        font-weight: bolder;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    input[type="text"],
    select,
    textarea {
        padding: 0.75rem;
        background-color: var(--color-background-primary);
        font-family: inherit;
        font-weight: 500;
        
        border: none;
        border-radius: 0.5rem;
        
        font-size: 1rem;
        
        color: var(--color-text-primary);

        box-shadow: 0 0 0 3px rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.25);
        transition: all 0.3s ease;
    }

    input[type="text"]:focus,
    select:focus,
    textarea:focus {
        outline: none;
        border-color: var(--color-blue-secondary);
        background-color: var(--color-background-primary);
        box-shadow: 0 0 0 3px rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.45);
    }

    option {
        color: var(--color-text-primary)
    }

    option:disabled {
        color: var(--color-text-secondary);
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

        .image-upload-container {
        width: 100%;
    }

    .image-upload-area {
        position: relative;
        width: 100%;
        min-height: 120px;
        border: 2px dashed rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.4);
        border-radius: 0.75rem;
        background-color: rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.02);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .image-upload-area:hover {
        border-color: rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.6);
        background-color: rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.05);
    }

    .image-upload-area.drag-over {
        border-color: var(--color-blue-primary);
        background-color: rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.1);
        transform: scale(1.02);
    }

    .image-upload-area.has-image {
        border-style: solid;
        border-color: rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.3);
        background-color: rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.05);
    }

    .file-input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    .upload-prompt {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        text-align: center;
    }

    .upload-icon {
        color: var(--color-blue-primary);
        opacity: 0.7;
    }

    .upload-text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .upload-primary {
        font-weight: 600;
        color: var(--color-text-primary);
        font-size: 1rem;
    }

    .upload-secondary {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    .image-preview {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 1rem 1.25rem;
    }

    .image-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .image-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background-color: rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.1);
        border-radius: 0.5rem;
        color: var(--color-blue-primary);
    }

    .image-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .image-name {
        font-weight: 600;
        color: var(--color-text-primary);
        font-size: 0.95rem;
    }

    .image-size {
        font-size: 0.8rem;
        color: var(--color-text-secondary);
    }

    .remove-image {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background-color: rgba(var(--color-red-primary), 0.1);
        border: none;
        border-radius: 50%;
        color: var(--color-red-primary);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .remove-image:hover {
        background-color: rgba(var(--color-red-primary), 0.15);
        transform: scale(1.1);
    }

    textarea {
        min-height: 150px;
        resize: none;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
    }

    button {
        padding: 0.75rem 1.5rem;
        border-radius: 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
        border: none;
    }

    button.confirm {
        background-color: var(--color-blue-primary);
        color: var(--color-text-button);
    }

    button.confirm:hover {
        background-color: var(--color-blue-secondary);
    }
    
    button.confirm:active {
        transform: translateY(1px);
    }
    
    button.confirm:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .character-count-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
    }
      
    .character-count {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }
      
    .over-limit {
        color: var(--color-red-primary);
        font-weight: 500;
    }
      
    .limit-warning {
        font-style: italic;
        margin-left: 0.5rem;
    }

    @media screen and (max-width: 768px) {
        .content {
            padding: 1.5rem;
            margin: 2rem 1rem;

            width: 64vw;
            max-width: 540px;

            gap: 1.5rem;
        }
        
        .form-actions {
            flex-direction: column;
        }
        
        button {
            width: 100%;
        }
    }

</style>
