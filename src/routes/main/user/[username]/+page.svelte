<script lang="ts">
    const { data } = $props();

    async function logout() {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/';
    }

</script>

<div class="container">
    <div class="profile-card">
        <div class="details">
            <img class="pfp" src="/default-dark.jpg" alt="pfp">
            <h2 class="username">{data.params_username}</h2>
            <h4 class="email-id">{data.params_email_id}</h4>
        </div>
        {#if data.authenticated && data.user?.username === data.params_username}
            <div class="buttons">
                <button class="settings-button">Settings</button>
                <button class="logout-button" onclick={logout}>Log Out</button>
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
    }

    .profile-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        width: 35vw;
        max-width: 700px;
        min-width: 400px;

        padding: 2rem;
        height: fit-content;
        background-color: var(--color-background-primary);
        border: solid 2px;
        border-color: var(--color-blue-primary);
        border-radius: 1rem;
    }

    .details {
        margin-bottom: 1rem;
        display: grid;
        grid-template-areas: 
            "pfp username"
            "pfp email-id";
        grid-template-columns: auto 1fr;
        grid-row-gap: 0; 
        grid-column-gap: 1rem;

        align-items: center; 
    }

    .pfp {
        grid-area: pfp;
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
    }

    .username {
        grid-area: username;
        
        margin: 0;
        padding-top: 1rem;
    }

    .email-id {
        grid-area: email-id;

        margin: 0;
        padding-bottom: 1rem;

        color: var(--color-text-secondary);
    }

    .buttons {
        display: flex;
        gap: 1rem;

        width: 100%;
    }

    .settings-button {
        padding: 0.55rem 1.5rem;
        font-size: 1rem;
        
        border: none;
        border-radius: 1rem;
        
        background-color: var(--color-blue-primary);
        color: var(--color-text-button);
        
        transition: background-color 0.3s ease;
    }

    .settings-button:hover {
        background-color: var(--color-blue-secondary);
        color: var(--color-text-button);
    }

    .logout-button {
        padding: 0.55rem 1.5rem;
        font-size: 1rem;
        
        border-radius: 1rem;
        border-color: var(--color-blue-secondary);
        
        background-color: transparent;
        color: var(--color-text-primary);
        
        transition: all 0.3s ease;
    }
    
    .logout-button:hover {
        border-color: var(--color-blue-primary);
        color: var(--color-text-secondary);
    }
</style>