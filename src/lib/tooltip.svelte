<script lang="ts">
    import { onDestroy } from 'svelte';

    // Props
    export let text: string = "";
    export let position: string = "" ;
    // Delay in ms before showing tooltip
    export let delay: number = 300; 
    export let bgColor: string = "var(--color-background-secondary)";
    export let textColor: string = "var(--color-text-primary)";
    export let padding: string = "0.5rem 0.75rem";
    export let borderRadius: string = "0.5rem";
    export let fontSize: string = "0.875rem";
    export let maxWidth: string = "200px";
    export let zIndex: string = "50";
    
    // Internal state
    let showTooltip = false;
    let tooltipTimeout: ReturnType<typeof setTimeout> | null = null;
    
    // Handle mouse events
    function handleMouseEnter() {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            showTooltip = true;
        }, delay);
    }
    
    function handleMouseLeave() {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            showTooltip = false;
        }, 100); 
    }
    
    // Clean up on component destroy
    onDestroy(() => {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
    });
    
</script>

<div 
    class="tooltip-container"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:focusin={handleMouseEnter}
    on:focusout={handleMouseLeave}
    role="presentation"
    >

    <slot></slot>
    
    {#if showTooltip && text}
        <div 
            class = "tooltip {position}" 
            style = "
                --bg-color: {bgColor};
                --text-color: {textColor};
                --padding: {padding};
                --border-radius: {borderRadius};
                --font-size: {fontSize};
                --max-width: {maxWidth};
                --z-index: {zIndex};
            "
            role = "tooltip"
        >
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
        background-color: var(--bg-color);
        color: var(--text-color);
        padding: var(--padding);
        border-radius: var(--border-radius);
        font-size: var(--font-size);
        max-width: var(--max-width);
        z-index: var(--z-index);
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: opacity 0.2s ease;
    }
    
    .tooltip.bottom {
        top: 80%;
        left: 70%;
        transform: translateX(-50%) translateY(8px);
        margin-top: 5px;
    }

</style>

