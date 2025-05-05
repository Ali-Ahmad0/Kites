<div class="container">
    <div class="card">
        <h3>Featured Posts</h3>
        <div class="posts">
            <!-- Posts will eventually go here -->
        </div>
    </div>
</div>

<style>

    .container {
        position: fixed;
        top: 84px;
        right: 24px;

        width: 20vw;

        max-width: 400px;
        min-width: 240px;
        
        height: 35vw;
        
        max-height: 400px;
        min-height: 320px;
        
        padding: 20px 10px;
    }

    .card {
        background-color: var(--color-background-secondary);
        border-radius: 0.5rem;
        height: 100%;
        display: flex;
        flex-direction: column;

        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card h3 {
        padding: 1rem;
        margin: 0;
        color: var(--color-text-secondary);
    }

    .posts {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }

    @media screen and (max-width: 1200px) {
        .container {
            display: none;
        }
    }
</style>