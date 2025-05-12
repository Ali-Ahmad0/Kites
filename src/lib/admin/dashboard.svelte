<script lang="ts">
    const { admin_stats } = $props();
</script>

{#if admin_stats}
    <div class="admin-dashboard">
        <h3>Admin Dashboard</h3>
        <div class="stat-grid">
            <div class="stat-card">
            <h4>Total Users</h4>
            <p>{admin_stats.total_users ?? 0}</p>
            </div>
            <div class="stat-card">
            <h4>Total Posts</h4>
            <p>{admin_stats.total_posts ?? 0}</p>
            </div>
        </div>
    
        <div class="stat-section">
            <h4>Users by Rank</h4>
            <ul>
            {#each admin_stats.users_by_rank ?? [] as item}
                <li>{item.rank}: {item._count}</li>
            {/each}
            </ul>
        </div>
    
        <div class="stat-section">
            <h4>Posts by Topic</h4>
            <ul>
            {#each admin_stats.posts_by_topic ?? [] as item}
                <li>{item.topic}: {item._count}</li>
            {/each}
            </ul>
        </div>
    
        <div class="stat-section">
            <h4>Posts by Type</h4>
            <ul>
            {#each admin_stats.posts_by_type ?? [] as item}
                <li>{item.type}: {item._count}</li>
            {/each}
            </ul>
        </div>
        </div>
{:else}
    <div class="admin-message">
        No admin statistics available
    </div>
{/if}

<style>
.admin-dashboard {
    margin: 2rem auto 0 auto;
    padding: 1.5rem;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-blue-primary);
    border-radius: 0.75rem;
    max-width: 720px;
    width: 100%;
    box-sizing: border-box;
}

.stat-grid {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.stat-card {
    flex: 1;
    padding: 1rem;
    min-width: 200px;
    background: var(--color-background-primary);
    border-radius: 0.5rem;
    text-align: center;
}

.stat-card h4 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    color: var(--color-text-primary);
}

.stat-card p {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-text-primary);
}

.stat-section {
    margin-bottom: 2rem;
}

.stat-section h4 {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    color: var(--color-text-secondary);
}

.stat-section ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
}

.stat-section li {
    background: var(--color-background-primary);
    margin-bottom: 0.25rem;
    padding: 0.5rem 1rem;
    border-radius: 0.4rem;
}

.admin-message {
    color: var(--color-text-secondary);
    padding: 1rem;
}
</style>