<script lang="ts">
	import { CreatePost, Thumbnail } from '$lib';
    import { fade, scale } from 'svelte/transition';
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

    const { data } = $props();
    
    // State for modal visibility
    let show_modal = $state(false);
    
    // // Toggle modal visibility
    // function toggle_modal() {
    //     // Redirect to login if needed
    //     if (!data.authenticated) {
    //         goto('/login/signin');
    //     }

    //     show_modal = !show_modal;
    // }
    
    // // Close modal when clicking outside
    // function handle_outside_click(event: MouseEvent) {
    //     const target = event.target as HTMLElement;
    //     if (target.classList.contains('modal-backdrop')) {
    //         show_modal = false;
    //     }
    // }
    
    // // Keyboard event handler for modal backdrop
    // function handle_backdrop_keydown(event: KeyboardEvent) {
    //     // Close modal on Escape key
    //     if (event.key === 'Escape') {
    //         show_modal = false;
    //     }
    // }
</script>

{#each data.posts as post }
    <Thumbnail post_id={post.id} user_liked={post.user_liked} 
    username={post.author_name} topic={post.topic} heading={post.heading} />
{/each}

<CreatePost/>