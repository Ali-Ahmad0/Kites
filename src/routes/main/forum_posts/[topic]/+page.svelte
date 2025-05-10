<script lang="ts">
	import { page } from '$app/state';
	import { Thumbnail, Featured } from '$lib';
	import { onMount, onDestroy } from 'svelte';

    const { data } = $props();

    let posts = $state(data.posts);
    let current_page = $state(1);

    let is_loading = $state(false);
    let has_more_posts = $state(true);

    async function load_more_posts() {
        if (is_loading || !has_more_posts) 
            return;

        try {
            is_loading = true;
            current_page++;
            
            // Fetch the next page
            const response = await fetch(`/api/forum/load?page=${current_page}&topic=${page.params.topic}`);
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
    let sentinel: HTMLDivElement;

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

{#each data.posts as post }
    <Thumbnail post_id={post.id} username={post.author_name} pfp={post.author_pfp}
    topic={post.topic} user_liked={post.user_liked} heading={post.heading} image={post.image_url} type={post.type}/>
{/each}
<div bind:this={sentinel}></div>

{#if is_loading}
    <p>Loading...</p>
{/if}

<Featured posts={data.featured_posts} />