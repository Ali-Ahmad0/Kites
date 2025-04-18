<script lang="ts">
    import { is_dark_mode } from '$lib';
    import { goto } from '$app/navigation'; 
    
    const { data } = $props();

    let mode : string = $state("dark_mode_icons");

    $effect(() => {
        mode = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    })
    
    async function logout() {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/';
    }
</script>

<div class="container">
    <div class="profile-card">
        <div class="details">
            <div class="pfp-container">
                <img class="pfp" src="/profile.jpg" alt="pfp">
            </div>
            <div class="user-info">
                <h2 class="username">{data.params_username}</h2>
                <h4 class="email-id">{data.params_email_id}</h4>
            </div>
        </div>
        
        {#if data.authenticated && data.user?.username === data.params_username}
            <div class="divider"></div>
            <div class="buttons">
                <button class="settings-button" onclick={() => goto('/main/user/settings')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                </button>
                <button class="logout-button" onclick={logout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log Out
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        
        margin-top: 2rem;
        padding: 0 1rem;
    }

    .profile-card {
        display: flex;
        flex-direction: column;
        
        width: 100%;
        max-width: 500px;
        
        padding: 2rem;
        
        background-color: var(--color-background-primary);
        
        border: solid 1px var(--color-blue-primary);
        border-radius: 1rem;

        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .details {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        
        width: 100%;
    }

    .pfp-container {
        position: relative;
        flex-shrink: 0;
    }

    .pfp {
        width: 6rem;
        height: 6rem;
        
        border-radius: 50%;
        border: solid 3px var(--color-blue-primary);
        
        object-fit: cover;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .user-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
    }

    .username {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        
        color: var(--color-text-primary);
    }

    .email-id {
        margin: 0.5rem 0 0 0;
        
        font-size: 1rem;
        font-weight: 400;
        
        color: var(--color-text-secondary);
    }

    .divider {
        width: 100%;
        height: 1px;
        
        background-color: var(--color-navigation-border);
        
        margin: 1.5rem 0;
    }

    .buttons {
        display: flex;
        gap: 1rem;
        width: 100%;
    }

    .settings-button, .logout-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        
        padding: 0.65rem 1.25rem;
        
        font-size: 0.95rem;
        font-weight: 500;
        
        border-radius: 0.75rem;
        
        cursor: pointer;
        
        transition: all 0.2s ease;
    }

    .settings-button {
        flex: 1;
        
        background-color: var(--color-blue-primary);
        color: var(--color-text-button);
        
        border: none;
    }

    .settings-button:hover {
        background-color: var(--color-blue-secondary);
        transform: translateY(-2px);
    }

    .settings-button:active {
        transform: translateY(0);
    }

    .logout-button {
        flex: 1;
        
        background-color: transparent;
        color: var(--color-text-primary);
        
        border: 1px solid var(--color-navigation-border);
    }
    
    .logout-button:hover {
        border-color: var(--color-blue-primary);
        color: var(--color-blue-primary);

        transform: translateY(-2px);
    }

    .logout-button:active {
        transform: translateY(0);
    }

    @media (max-width: 500px) {
        .details {
            flex-direction: column;
            text-align: center;

            gap: 1rem;
        }

        .buttons {
            flex-direction: column;
        }
    }
</style>