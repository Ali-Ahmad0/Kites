<div class="loading-more">
    <div class="spinner-small"></div>
    <span>Loading more...</span>
</div>

<style>
    .spinner-small {
        width: 20px;
        height: 20px;
        
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: var(--color-blue-primary);
        
        animation: spin 1s ease-in-out infinite;
        margin-right: 0.5rem;
    }
    
    .loading-more {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 1rem;
        color: var(--color-text-secondary);
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>