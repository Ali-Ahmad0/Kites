<script lang="ts">
    import { onDestroy } from 'svelte';

    let { children, text } = $props();    
    let delay = 400;

    // Internal state
    let show_tooltip: boolean = $state(false);
    let tooltip_timeout: ReturnType<typeof setTimeout> | null = null;
    let tooltip_element: HTMLDivElement | undefined = $state(undefined)
    
    // Handle mouse events
    function handle_mouse_enter() {
        if (tooltip_timeout) 
            clearTimeout(tooltip_timeout);
        
        tooltip_timeout = setTimeout(() => { show_tooltip = true; }, delay);
    }
    
    function handle_mouse_leave() {
        if (tooltip_timeout) 
            clearTimeout(tooltip_timeout);
        
        tooltip_timeout = setTimeout(() => {show_tooltip = false; }, delay); 
    }
    
    onDestroy(() => {
        if (tooltip_timeout) 
            clearTimeout(tooltip_timeout);
    });
</script>

<div class="tooltip-container" onmouseenter={handle_mouse_enter} onmouseleave={handle_mouse_leave} onfocusin={handle_mouse_enter} role="presentation">
     {@render children()}

    {#if show_tooltip && text}
        <div class="tooltip" role="tooltip" bind:this={tooltip_element}>
            {text}
        </div>
    {/if}
</div> 

<style>
    .tooltip-container {
        position: relative;
        display: inline-flex;
        width: fit-content;
    }
    
    .tooltip {
        position: absolute;
        left: 50%;
        bottom: -0.5rem;
        transform: translateX(-50%) translateY(100%);

        background-color: var(--color-background-secondary, #333);
        color: var(--color-text-primary, #fff);
                
        padding: 0.5rem 0.75rem;
        
        border-radius: 0.5rem;
        z-index: 10;
        
        white-space: nowrap;
        pointer-events: none;

        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .tooltip::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 0 6px 6px 6px;
        border-style: solid;
        border-color: transparent transparent var(--color-background-secondary, #333) transparent;
    }
</style>