<script lang="ts">
    const { admin_stats } = $props();
</script>

{#if admin_stats}
    <div class="admin-dashboard">
        <div class="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p class="dashboard-subtitle">Overview of platform statistics and metrics</p>
        </div>

        <!-- Key Metrics Grid -->
        <div class="metrics-grid">
            <div class="metric-card primary">
                <div class="metric-content">
                    <h3>Total Users</h3>
                    <p class="metric-value">{admin_stats.total_users ?? 0}</p>
                </div>
            </div>
            
            <div class="metric-card secondary">
                <div class="metric-content">
                    <h3>Total Posts</h3>
                    <p class="metric-value">{admin_stats.total_posts ?? 0}</p>
                </div>
            </div>
        </div>

        <!-- Statistics Sections -->
        <div class="stats-grid">
            <div class="stats-card">
                <div class="stats-header">
                    <h3>Users by Rank</h3>
                    <span class="stats-count">{admin_stats.users_by_rank?.length ?? 0} ranks</span>
                </div>
                <div class="stats-content">
                    {#if admin_stats.users_by_rank && admin_stats.users_by_rank.length > 0}
                        <div class="stats-list">
                            {#each admin_stats.users_by_rank as item}
                                <div class="stats-item">
                                    <span class="stats-label">{item.rank}</span>
                                    <span class="stats-value">{item._count}</span>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="empty-state">No rank data available</div>
                    {/if}
                </div>
            </div>

            <div class="stats-card">
                <div class="stats-header">
                    <h3>Posts by Topic</h3>
                    <span class="stats-count">{admin_stats.posts_by_topic?.length ?? 0} topics</span>
                </div>
                <div class="stats-content">
                    {#if admin_stats.posts_by_topic && admin_stats.posts_by_topic.length > 0}
                        <div class="stats-list">
                            {#each admin_stats.posts_by_topic as item}
                                <div class="stats-item">
                                    <span class="stats-label">{item.topic}</span>
                                    <span class="stats-value">{item._count}</span>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="empty-state">No topic data available</div>
                    {/if}
                </div>
            </div>

            <div class="stats-card">
                <div class="stats-header">
                    <h3>Posts by Type</h3>
                    <span class="stats-count">{admin_stats.posts_by_type?.length ?? 0} types</span>
                </div>
                <div class="stats-content">
                    {#if admin_stats.posts_by_type && admin_stats.posts_by_type.length > 0}
                        <div class="stats-list">
                            {#each admin_stats.posts_by_type as item}
                                <div class="stats-item">
                                    <span class="stats-label">{item.type}</span>
                                    <span class="stats-value">{item._count}</span>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="empty-state">No type data available</div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="admin-message">
        <h3>No Data Available</h3>
        <p>Statistics are currently unavailable due to an unexpected issue.</p>
    </div>
{/if}

<style>
    .admin-dashboard {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 2rem 1rem;
    }

    .dashboard-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .dashboard-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--color-text-primary);

        margin: 0 0 0.5rem 0;
    }

    .dashboard-subtitle {
        font-size: 1.1rem;
        color: var(--color-text-primary);

        opacity: 0.7;
        margin: 0;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .metric-card {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        
        padding: 2rem;
        background: var(--color-background-secondary);
        border: 2px solid var(--color-navigation-border);
        
        border-radius: 1rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .metric-card::before {
        content: '';

        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;

        background: var(--color-blue-primary);

        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .metric-card:hover {
        border-color: var(--color-blue-primary);
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
    }

    .metric-card:hover::before {
        transform: scaleX(1);
    }

    .metric-card.secondary::before {
        background: var(--color-blue-secondary);
    }

    .metric-content h3 {
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-text-primary);

        margin: 0 0 0.5rem 0;
        opacity: 0.8;
    }

    .metric-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--color-text-primary);

        margin: 0;
        line-height: 1;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }

    .stats-card {
        background: var(--color-background-secondary);
        border: 2px solid var(--color-navigation-border);
        border-radius: 12px;
        
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .stats-card:hover {
        border-color: var(--color-blue-primary);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .stats-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        
        align-items: center;
        padding: 1.5rem 2rem;
        
        border-bottom: 1px solid var(--color-navigation-border);
        background: var(--color-background-primary);

    }

    .stats-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        
        color: var(--color-text-primary);
    }

    .stats-count {
        font-size: 0.875rem;
        color: var(--color-text-primary);
        opacity: 0.6;
        background: var(--color-navigation-border);
        
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
    }

    .stats-content {
        padding: 1.5rem 2rem;
    }

    .stats-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .stats-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        
        background: var(--color-background-primary);
        
        border-radius: 0.5rem;
        transition: all 0.2s ease;
    }

    .stats-item:hover {
        background: var(--color-navigation-border);
        transform: translateX(4px);
    }

    .stats-label {
        font-weight: 500;
        color: var(--color-text-primary);
        text-transform: capitalize;
    }

    .stats-value {
        font-weight: 600;
        color: var(--color-blue-primary);
        background: rgba(59, 130, 246, 0.1);
        
        padding: 0.25rem 0.75rem;
        
        border-radius: 0.75rem;
        font-size: 0.875rem;
    }

    .empty-state {
        text-align: center;
        padding: 2rem;
        
        color: var(--color-text-primary);
        opacity: 0.6;
        font-style: italic;
    }

    .admin-message {
        max-width: 500px;
        margin: 4rem auto;
        padding: 3rem 2rem;

        background: var(--color-background-secondary);
        
        border: 2px solid var(--color-navigation-border);
        border-radius: 16px;
        
        text-align: center;
    }

    .admin-message h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 1rem 0;
    }

    .admin-message p {
        color: var(--color-text-primary);
        opacity: 0.7;
        margin: 0;
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .admin-dashboard {
            padding: 1rem;
        }

        .dashboard-header h1 {
            font-size: 2rem;
        }

        .metrics-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .stats-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .metric-card {
            padding: 1.5rem;
            gap: 1rem;
        }

        .metric-value {
            font-size: 2rem;
        }

        .stats-header,
        .stats-content {
            padding: 1rem 1.5rem;
        }

        .stats-item {
            padding: 0.75rem 1rem;
        }
    }

    @media (max-width: 480px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }

        .metric-card {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
        }

        .stats-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
        }
    }
</style>
