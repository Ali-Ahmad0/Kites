<script lang="ts">
    import { Thumbnail, Featured, Loading, LoadingMore } from "$lib";
    import { onDestroy, onMount } from "svelte";
    
    const { data } = $props();

    let posts : any = $state([]);
    let current_page = $state(1);
    
    let is_loading = $state(false);
    let has_more_posts = $state(true);
    
    // Handle streamed data when it resolves
    $effect(() => {
        if (data.streamed) {
            data.streamed.then(streamed_data => {
                posts = streamed_data.posts;
            });
        }
    });

    async function load_more_posts() {
        if (is_loading || !has_more_posts) 
            return;

        try {
            is_loading = true;
            current_page++;
            
            // Fetch the next page
            const response = await fetch(`/api/forum/load?page=${current_page}&topic=`);
            const new_data = await response.json();

            if (new_data.posts && new_data.posts.length > 0) {
                // Append new posts to existing ones
                posts = [...posts, ...new_data.posts];
            } else {
                has_more_posts = false;
            }
        } catch (e) {
            console.error('[KITES | ERROR]: Error loading more posts: ', e);
        } finally {
            is_loading = false;
        }
    }

    // Intersection Observer to detect when user scrolls to bottom
    let observer: IntersectionObserver | null;
    let sentinel: HTMLDivElement | undefined = $state(undefined);
    
    onMount(() => {
        observer = new IntersectionObserver((entries) => {
            // Load when reaching end of page
            if (entries[0].isIntersecting && !is_loading) {
                load_more_posts();
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

{#await data.streamed}
    <Loading text="Loading posts..."/>
{:then posts_data} 
    {#each posts as post}
        <Thumbnail post_id={post.id} pfp={post.author_pfp} username={post.author_name} 
        topic={post.topic} heading={post.heading} user_liked={post.user_liked} image={post.image_url} type={post.type}/>
    {/each}
    
    <div bind:this={sentinel}>
        {#if is_loading}
            <LoadingMore/>
        {/if}
    </div>

    <Featured posts={posts_data.featured_posts}/>
{/await}