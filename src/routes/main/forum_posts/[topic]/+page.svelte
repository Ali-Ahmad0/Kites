<script lang="ts">
	import { CreatePost, Thumbnail } from '$lib';

    const { data } = $props();


</script>

{#each data.posts as post }
    <Thumbnail post_id={post.id} username={post.author_name} 
    topic={post.topic} user_liked={post.user_liked} heading={post.heading} image={post.imageUrl}/>
{/each}

<CreatePost/>
    <!-- Modal backdrop and content
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
                    <form use:enhance={() => {
                        return async ({ form, data, result, update }) => {
                            const formData = new FormData(form);
                    
                            const response = await fetch(form.action, {
                                method: form.method,
                                body: formData,
                            });
                    
                            if (response.ok) {
                                await update(); // refresh data
                            } else {
                                goto('/login/signin');
                            }
                        };
                    }} method="POST" action="?/create" enctype="multipart/form-data">
                    

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

                        <div class="form-group">
                            <label for="image">Image</label>
                            <input type="file" id="image" name="image">
                        </div>
                        
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
</div> -->

