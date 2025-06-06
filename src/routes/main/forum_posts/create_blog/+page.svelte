<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

   // character limit configuration based on user type
   type RankType = 'default' | 'Bronze' | 'Silver' | 'Gold' | 'Admin';
    
    const character_limits: Record<RankType, number> = {
        'default': 1500,
        'Bronze': 2500,
        'Silver': 5000,
        'Gold': 8000,
        'Admin': 10000
    };

    // Get user rank
    let user_rank: string = page.data.rank;

    // Now validate the rank
    let rank: RankType = Object.keys(character_limits).includes(user_rank) ? user_rank as RankType : 'default';

    // Define character limit reactively
    let character_limit = character_limits[rank];
      
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
    
    function cancel_creation() {
        window.location.href = '/'
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

<div class="content">
    <div class="form-group">
        <label for="heading">Heading</label>
        <input type="text" id="heading" name="heading" bind:value={heading_text} required>
         <div class="character-count-container">
            <span class={heading_too_large ? "character-count over-limit" : "character-count"}>
                {character_count_heading} / 70 characters
            </span>
        </div>
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
        <input type="file" id="image" name="image" onchange={handle_file_upload} accept="image/*" required>
        <span class="file-hint">{image ? `Selected: ${image.name}` : 'No file selected'}</span>
    </div>

    <div class="form-group">
        <label for="content">Content</label>
        <textarea id="content" name="content" rows="10" bind:value={content_text} required></textarea>
        <div class="character-count-container">
            <span class={is_over_limit ? "character-count over-limit" : "character-count"}>
                {character_count} / {character_limit} characters
                {#if is_over_limit}
                    <span class="limit-warning">(exceeds {rank} user limit)</span>
                {/if}
            </span>
        </div>
    </div>
    
    <div class="form-actions">
        <button type="button" class="cancel" onclick={cancel_creation}>
            Cancel
        </button>
        
        <button type="button" class="confirm" onclick={create_blogpost}
            disabled={!heading_text.trim() || !topic_chosen.trim() || !content_text.trim() || is_creating || is_over_limit || heading_too_large}>
            {is_creating ? 'Creating...' : 'Create Post'}
        </button>
    </div>
</div>


<style>  
  .content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      
      background-color: var(--color-background-secondary);
      border-radius: 1rem;
      border: 1px solid var(--color-blue-primary);
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
      box-shadow: 0 0 0 3px rgba(var(--color-blue-primary-rgb, 0, 120, 212), 0.2);
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
      border-radius: 0.5rem;
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
  
  button.cancel:active {
      transform: translateY(1px);
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
</style>
