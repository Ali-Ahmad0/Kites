<script lang="ts">
    let { text } = $props();
</script>

<div class="loading-container">
    <div class="spinner"></div>
    <p>{text}</p>
</div>

<style>
    .loading-container {
        display: flex;
        flex-direction: column;
        
        align-items: center;
        justify-content: center;
        
        padding: 3rem 1rem;
        text-align: center;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: var(--color-blue-primary);
        
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 1rem;
    }
    
    p {
        color: var(--color-text-primary);
        margin: 0;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
