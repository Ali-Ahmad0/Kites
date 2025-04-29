<script lang="ts">
    // import { fade, scale } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
      
    // State for modal visibility
    let show_modal = $state(true);

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

    function handle_file_upload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target?.files && target.files.length > 0) {
            image = target.files[0]; 
        } else {
            image = undefined;
        }
    }

    async function create_blogpost() {
        if (!heading_text.trim() || !topic_chosen.trim() || !content_text.trim()) return;

        try {
            is_creating = true;

            const form_data = new FormData();
            form_data.append('heading', heading_text);
            form_data.append('content', content_text);
            form_data.append('topic', topic_chosen);
            form_data.append('type', "blog");

            if (image) {
                form_data.append('image', image);
            }

            const response = await fetch('/api/forum/new', {
                method: 'POST',
                body: form_data 
            });

            if (response.status === 401) {
                goto('/login/signin');
                return;
            }

            if (response.status !== 200) {
                const data = await response.json();
                alert(data.error);
            }

            // Reset
            heading_text = "";
            content_text = "";
            topic_chosen = "";
            image = undefined;
            show_modal = false;

            window.location.reload();

        } catch (e) {
            console.error("[KITES | ERROR] Failed to create new blog post", e);
        } finally {
            is_creating = false;
        }
    }

</script>

{#if show_modal}
  <div class="form-container">
      <div class="content">
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
          <label for="image">Image</label>
          <div class="file-upload">
            <input type="file" id="image" name="image" onchange={handle_file_upload} accept="image/*" required>
            <div class="file-upload-label">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Choose a file</span>
            </div>
          </div>
        </div>
    
        <div class="form-group">
          <label for="content">Content</label>
          <textarea id="content" name="content" rows="5" bind:value={content_text} required></textarea>
        </div>

        <!-- <div class="form-group">
          <a href="/main/forum_posts/[topic}" class="create-forum-post">Create a discussion post</a>
        </div> -->
        
        <div class="form-actions">
          <button type="button" class="cancel" onclick={toggle_modal}>
            Cancel
          </button>
          
          <button type="button" class="confirm" onclick={create_blogpost}
                        disabled={!heading_text.trim() || !topic_chosen.trim() || !content_text.trim() || is_creating}>
                            {is_creating ? 'Creating...' : 'Create Blog post'}
          </button>
        </div>
      </div>
  </div>
{/if}
  
  <style>
    .form-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: var(--color-background-secondary);
      border-radius: 1rem;
      border: 1px solid var(--color-blue-primary);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }
  
    .content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  
    label {
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }
  
    input[type="text"],
    select,
    textarea {
      padding: 0.75rem;
      background-color: var(--color-background-primary);
      border: 1px solid var(--color-blue-primary);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      font-size: 1rem;
      transition: all 0.3s ease;
    }
  
    input[type="text"]:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: var(--color-blue-secondary);
      background-color: var(--color-background-primary);
    }
  
    .file-upload {
      position: relative;
      width: 100%;
      height: 150px;
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: var(--color-background-primary);
      transition: all 0.3s ease;
    }
  
    .file-upload:hover {
      border-color: var(--color-blue-primary);
      background-color: rgba(59, 130, 248, 0.05);
    }
  
    .file-upload input[type="file"] {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      z-index: 2;
    }
  
    .file-upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      color: var(--color-text-secondary);
      z-index: 1;
    }
  
    .file-upload-label svg {
      width: 2.5rem;
      height: 2.5rem;
      stroke-width: 1.5;
    }
  
    textarea {
      min-height: 150px;
      resize: vertical;
    }
  
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
  
    button {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s ease;
      border: none;
    }
  
    button.cancel {
      background-color: var(--color-red-primary);
      border: none;
      color: white;
    }
  
    button.cancel:hover {
      background-color: var(--color-red-secondary);
    }
  
    button.confirm {
      background-color: var(--color-blue-primary);
      color: var(--color-text-button);
    }
  
    button.confirm:hover {
      background-color: var(--color-blue-secondary);
    }
  
    @media screen and (max-width: 768px) {
      .form-container {
        padding: 1.5rem;
        margin: 1rem;
      }
      
      .content {
        gap: 1.5rem;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      button {
        width: 100%;
      }
    }
/* 
    .create-forum-post {
        text-decoration: none;
        color: var(--color-blue-primary);
        transition: color 0.2s ease;
    }

    .create-forum-post:hover {
        color: var(--color-blue-secondary);
    } */

  </style>