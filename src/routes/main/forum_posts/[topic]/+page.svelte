<script lang="ts">
	import { page } from "$app/state";
    import { Thumbnail, Featured, Loading, LoadingMore } from "$lib";
    import { onDestroy, onMount } from "svelte";
   
    const { data } = $props();
    let posts: any = $state([]);
    let current_page = $state(1);
   
    let is_initial_load = $state(true);
    let is_loading = $state(false);
    let has_more_posts = $state(true);
    let sentinel: HTMLDivElement;
    let observer: IntersectionObserver | null = null;
   
    // Handle streamed data when it resolves
    $effect(() => {
        if (data.streamed) {
            data.streamed.then(streamed_data => {
                posts = streamed_data.posts || [];
                
                // Mark as loaded when we actually have posts
                if (posts.length > 0) {
                    setTimeout(() => {
                        is_initial_load = false;
                        setup_observer(); // Setup observer after initial load
                    }, 500);
                }
            });
        }
    });

    function setup_observer() {
        // Clean up previous observer if it exists
        if (observer) {
            observer.disconnect();
        }

        // Create a new observer
        observer = new IntersectionObserver((entries) => {
            // Load when reaching end of page
            if (entries[0].isIntersecting && !is_loading && has_more_posts) {
                load_more_posts();
            }
        }, {
            rootMargin: '200px',
            threshold: 0.1
        });
        
        // Start observing if sentinel exists
        if (sentinel) {
            observer.observe(sentinel);
        }
    }
    
    async function load_more_posts() {
        if (is_loading || !has_more_posts) return;
        
        try {
            is_loading = true;
            current_page++;
            
            // Fetch the next page
            const response = await fetch(`/api/forum/load?page=${current_page}&topic=${page.params.topic}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const new_data = await response.json();
            
            if (new_data.posts && new_data.posts.length > 0) {
                // Append new posts to existing ones
                posts = [...posts, ...new_data.posts];
                
                // Re-establish the observer after DOM updates
                setTimeout(() => {
                    if (sentinel && observer) {
                        observer.observe(sentinel);
                    }
                }, 100);
            } else {
                has_more_posts = false;
            }
        } catch (e) {
            console.error('[KITES | ERROR]: Error loading more posts: ', e);
            has_more_posts = false; // Prevent further attempts on error
        } finally {
            is_loading = false;
        }
    }
   
    onMount(() => {
        // If we already have posts (SSR case), setup the observer immediately
        if (posts.length > 0 && !is_initial_load) {
            setup_observer();
        }
    });
   
    onDestroy(() => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    });
</script>

<div class="posts-container" class:content-loaded={!is_initial_load}>
    {#await data.streamed}
        <Loading text="Loading posts..."/>
    {:then posts_data}
        <div class="posts-list">
            {#each posts as post}
                <Thumbnail 
                    post_id={post.id} 
                    pfp={post.author_pfp} 
                    username={post.author_name}
                    topic={post.topic} 
                    heading={post.heading} 
                    user_liked={post.user_liked} 
                    image={post.image_url} 
                    type={post.type}
                />
            {/each}
        </div>
           
        <Featured posts={posts_data.featured_posts}/>
    {/await}
   
    <!-- Always keep sentinel visible at the bottom -->
    <div bind:this={sentinel} class="sentinel">
        {#if is_loading && !is_initial_load}
            <LoadingMore/>
        {:else if !has_more_posts && posts.length > 0}
            <div class="end-message">No more posts to load</div>
        {/if}
    </div>
</div>

<style>
    .posts-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    
    .content-loaded {
        width: fit-content;
    }
    
    .posts-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .sentinel {
        padding: 1rem 0;
        margin-top: 1rem;
        width: 100%;
        min-height: 50px;
    }
    
    .end-message {
        text-align: center;
        padding: 1rem;
        color: var(--color-text-secondary);
    }
</style>