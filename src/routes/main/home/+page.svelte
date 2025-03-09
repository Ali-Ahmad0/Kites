<!-- <script lang="ts">
    const { data } = $props();
</script>

<ul>
    {#await data.kites}
        <li></li>  
    {:then kitesData} 
        {#each kitesData as kite}
            <li>{kite.name}</li>
        {/each}
    {/await}
</ul> -->

<script lang="ts">
    // Define the Post type
    type Post = {
        id: string;
        title: string;
        content: string;
        author: string;
        createdAt: Date;
    };

    // Pass data from +page.server.ts to this page
    export let data;

    let posts: Post[] = data.posts; // Initial posts
    let loading = false;
    let page = 1;

    // Function to load more posts (infinite scroll)
    async function fetchMorePosts() {
        loading = true;
        const postId = "67cd3f7b8ab834dfd1dfa9d8"; // Ensure postId is a string and not an Object
        const response = await fetch(`/api/posts?page=${page}`);
        const newPosts: Post[] = await response.json();
        posts = [...posts, ...newPosts]; // Append new posts
        page += 1;
        loading = false;
    }

    import { onMount } from 'svelte';

    // Detect when user scrolls to the bottom
    function handleScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
            fetchMorePosts();
        }
    }

    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    // Helper function to format the date
    function formatDate(date: Date): string {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
</script>

<!-- Vertical List of Posts -->
<div class="post-list">
    {#each posts as post}
        <div class="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div class="post-meta">
                <span>Author: {post.author}</span>
                <span>Created At: {formatDate(post.createdAt)}</span>
            </div>
        </div>
    {/each}
</div>

<!-- Loading Spinner -->
{#if loading}
    <div class="loading-spinner">Loading...</div>
{/if}

<style>
    .post-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
    }

    .post {
        background: var(--color-background-primary);
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .post h3 {
        margin: 0 0 8px 0;
        font-size: 1.25rem;
        color: var(--color-text-secondary);
    }

    .post p {
        margin: 0 0 8px 0;
        color: #555;
    }

    .post-meta {
        display: flex;
        gap: 16px;
        font-size: 0.875rem;
        color: #888;
    }

    .loading-spinner {
        text-align: center;
        padding: 16px;
        font-style: italic;
        color: #888;
    }
</style>