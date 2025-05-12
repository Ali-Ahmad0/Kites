<script lang="ts">
    const { posts } = $props();
</script>

<div class="container">
    <div class="card">
        <h3>Featured Posts</h3>
        <div class="posts">
            {#each posts as post}
                <div class="featured-post">
                    <img
                        src={post.author_pfp || '/profile.jpg'}
                        alt={post.author_name}
                        onerror={(e) => { const target = e.target as HTMLImageElement; if (target) target.src = '/profile.jpg'; }}
                        class="author-pfp"
                    />
                    <div class="post-info">
                        <a href="/main/forum_posts/{post.topic}/{post.id}" class="post-link">
                            <h4>{post.heading}</h4>
                        </a>
                        <span class="likes">❤️ {post.likes}</span>
                        <a href="/main/forum_posts/{post.topic}" class="topic-link">
                            <span class="topic">#{post.topic}</span>
                        </a>
                    </div>
                </div>
            {:else}
                <p class="empty">No featured posts yet</p>
            {/each}
        </div>
    </div>
</div> 

<style>
    .featured-post {
        display: flex;
        gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid var(--color-navigation-border);
    }
    
    .author-pfp {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .post-info {
        flex: 1;
        overflow: hidden;
    }

    .post-link, .topic-link {
        text-decoration: none;
    }
    
    .post-link {
        color: var(--color-text-primary);
    }

    .topic-link {
        color: var(--color-text-secondary);
    }

    .post-link:hover, .topic-link:hover {
        text-decoration: underline;
    }
    
    .post-info h4 {
        margin: 0;
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .likes, .topic {
        font-size: 0.8rem;
        color: var(--color-text-secondary);
        margin-right: 8px;
    }
    
    .empty {
        color: var(--color-text-secondary);
        text-align: center;
        font-style: italic;
        padding: 1rem;
    }

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