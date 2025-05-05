<script lang="ts">
    import { is_dark_mode } from '$lib';
    import { goto } from '$app/navigation';
    import { Icon } from '$lib';
    import { Tooltip } from '$lib';

    const { data } = $props();

    let mode: string = $state("dark_mode_icons");
    let image: File | undefined = $state();
    
    let show_dropdown: boolean = $state(false);
    let show_confirm: boolean = $state(false);
    let is_deleting: boolean = $state(false);

    let folder: string = $state("dark_mode_icons");
    $effect(() => {
        folder = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    });

    async function change_pfp(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target?.files && target.files.length > 0) {
            image = target.files[0]; 
        } else {
            image = undefined;
        }

        if (!image) return;
        
        try {
            const form_data = new FormData();
            form_data.append('image', image);
            
            const response = await fetch('/api/user/change_pfp', {
                method: 'POST',
                body: form_data
            });

            if (response.status === 200) {
                window.location.reload();
            } else {
                const data = await response.json();
                alert(data.error);
            }
        } catch (e) {
            console.error('[KITES | ERROR]: ', e);
        }
    }

    $effect(() => {
        mode = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    })
    
    async function logout() {
        try {
            const resp = await fetch('/api/user/logout', { method: 'POST' });
            
            if (resp.status === 200) {
                window.location.href = '/';
            } else {
                const data = await resp.json();
                alert(data.error);
            }
        } catch(e) {
            console.error(e);
        }
    }

    async function delete_account() {
        try {
            is_deleting = true;
            const resp = await fetch('/api/user/delete', { method: 'POST'});
            
            if(resp.status === 200) {
                window.location.href = '/';
            } else {
                const data = await resp.json();
                alert(data.error);
            }
        } catch (e) {
            console.error('[KITES | ERROR]: ', e);
        } finally {
            is_deleting = false;
        }
    }

    function toggle_drowpdown() {
        show_dropdown = !show_dropdown;
        // Close confirmation dialog if open when toggling dropdown
        if (show_confirm) {
            show_confirm = false;
        }
    }

    // Close dropdown when clicking outside
    function handle_outside_click(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.more-options') && !target.closest('.confirm-dialog')) {
            show_dropdown = false;
        }
    }

    function ask_delete_confirmation() {
        show_dropdown = false;
        show_confirm = true;
    }

    function cancel_delete() {
        show_confirm = false;
    }
</script>

<svelte:window on:click={handle_outside_click} />

<div class="container">
    {#await data}
        <div class="profile-card">
            <div class="details">
                <div class="pfp-container">
                    <img src="/profile.jpg" alt="pfp" class="pfp">
                    <h2 class="username">Loading...</h2>
                    <h4 class="email-id">Loading...</h4>
                </div>
            </div>
        </div>
    {:then data}

        <div class="profile-card">
            <div class="details">

                <div class="pfp-container">
                    {#if data.authenticated && data.user?.username === data.params_username}
                        <label for="image" class="pfp-label">
                            {#if data.image}
                                <img src={data.image || "/placeholder.svg"} alt="pfp" class="pfp">
                            {:else}
                                <img src="/profile.jpg" alt="pfp" class="pfp">
                            {/if}
                            <div class="pfp-overlay">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                        </label>
                        <input type="file" id="image" name="image" accept="image/*" onchange={change_pfp}>
                    {:else}
                        {#if data.image}
                            <img src={data.image || "/placeholder.svg"} alt="pfp" class="pfp">
                        {:else}
                            <img src="/profile.jpg" alt="pfp" class="pfp">
                        {/if}
                    {/if}
                </div>
                <div class="user-info">
                    <div class="username-container">
                        <h2 class="username">{data.params_username}</h2>
                        {#if data.rank !== 'default'}
                            <Tooltip text={data.rank}>
                                <Icon mode={undefined} name={data.rank} width=36 height=36 alt="verified"/>
                            </Tooltip>
                        {/if}
                        
                    </div>
                    <h4 class="email-id">{data.params_email_id}</h4>
                </div>
                
                {#if data.authenticated && data.user?.username === data.params_username}
                <div class="more-options">
                    <Tooltip text="More">
                        <button class="more" onclick={toggle_drowpdown}>
                            <Icon mode={folder} name="more_h" width=24 height=24 alt="more" />
                        </button>
                    </Tooltip>
                    
                    {#if show_dropdown}
                        <div class="dropdown-menu">
                            <button class="dropdown-item delete-account" onclick={ask_delete_confirmation}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Delete Account
                            </button>
                        </div>
                    {/if}
                </div>
                {/if}
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
    {/await}

    {#if show_confirm}
        <div class="confirm-dialog">
            <div class="confirm-content">
                <h3>Delete Account?</h3>
                <p>This action cannot be undone. All your data will be permanently deleted.</p>
                <div class="confirm-buttons">
                    <button class="cancel-button" onclick={cancel_delete}>
                        Cancel
                    </button>
                    <button class="delete-button" onclick={delete_account}>
                        {is_deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    {/if}
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
        
        object-fit: cover;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .pfp-label {
        position: relative;
        display: block;
        cursor: pointer;
        border-radius: 50%;
    }

    .pfp-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 93%;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.2s ease;
        color: white;
    }

    .pfp-overlay svg {
        margin-bottom: 0.25rem;
    }

    .pfp-label:hover .pfp-overlay {
        opacity: 1;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
    }

    .username-container{
        display: flex;
        gap: 0.5rem;
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

    .more-options {
        margin-bottom: auto;
        position: relative;
    }

    .more {
        background-color: transparent;
        border: none;
        cursor: pointer;
        transition: opacity 0.2s ease;
    }

    .more:hover {
        opacity: 0.7;
    }

    /* Dropdown menu styles */
    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 10;
        
        min-width: 180px;
        
        margin-top: 0.5rem;
        padding: 0.5rem;
        
        background-color: var(--color-background-primary);
        
        border: 1px solid var(--color-navigation-border);
        border-radius: 0.75rem;
        
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        width: 100%;
        
        padding: 0.75rem;
        
        font-size: 0.95rem;
        font-weight: 500;
        
        background-color: transparent;
        border: none;
        border-radius: 0.5rem;
        
        cursor: pointer;
        
        transition: background-color 0.2s ease;
    }

    .delete-account {
        color: var(--color-red-secondary);
    }

    .delete-account:hover {
        background-color: rgba(229, 57, 53, 0.1);
    }

    .delete-account svg {
        color: var(--color-red-secondary);
    }

    .confirm-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        
        display: flex;
        justify-content: center;
        align-items: center;
        
        background-color: rgba(0, 0, 0, 0.5);
    }

    .confirm-content {
        width: 90%;
        max-width: 400px;
        
        padding: 1.5rem;
        
        background-color: var(--color-background-primary);
        
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .confirm-content h3 {
        margin-top: 0;
        margin-bottom: 0.75rem;
        
        font-size: 1.25rem;
        font-weight: 600;
        
        color: var(--color-red-secondary);
    }

    .confirm-content p {
        margin-bottom: 1.5rem;
        
        font-size: 0.95rem;
        
        color: var(--color-text-secondary);
    }

    .confirm-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
    }

    .cancel-button, .delete-button {
        padding: 0.65rem 1.25rem;
        
        font-size: 0.95rem;
        font-weight: 500;
        
        border-radius: 0.75rem;
        
        cursor: pointer;
        
        transition: all 0.2s ease;
    }

    .cancel-button {
        background-color: transparent;
        color: var(--color-text-primary);
        
        border: 1px solid var(--color-navigation-border);
    }
    
    .cancel-button:hover {
        border-color: var(--color-blue-primary);
        color: var(--color-blue-primary);
    }

    .delete-button {
        background-color: var(--color-red-secondary);
        color: white;
        
        border: none;
    }
    
    .delete-button:hover {
        background-color: var(--color-red-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(229, 57, 53, 0.4);
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

    input[type="file"] {
        display: none;
    }

    @media (max-width: 500px) {
        .details {
            flex-direction: column;
            text-align: center;

            gap: 1rem;
        }

        .more-options {
            align-self: flex-end;
            margin-top: 1rem;
        }

        .dropdown-menu {
            right: -1rem;
        }

        .buttons {
            flex-direction: column;
        }
    }
</style>