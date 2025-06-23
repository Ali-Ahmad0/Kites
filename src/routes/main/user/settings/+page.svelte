<script lang="ts">
    import { enhance } from "$app/forms";
	import { page } from "$app/state";
    
    let { form } = $props();

    if (!page.data.user) {
        window.location.href = '/login/signin';
    }
</script>

<svelte:head>
    <title>Kites | Account Settings</title>
</svelte:head>

<div class="app-layout">
    <main class="content">
        <div class="settings-wrapper">
            <div class="settings-header">
                <h1>Account Settings</h1>
                <p class="settings-subtitle">Manage your account preferences and security settings</p>
            </div>

            <div class="settings-grid">
                <!-- Username Settings Card -->
                <div class="settings-card">
                    <div class="card-header">
                        <h2>Username</h2>
                        <p class="card-description">Update your display name</p>
                    </div>
                    
                    <form method="POST" action="?/update_username" use:enhance class="settings-form">
                        <div class="form-group">
                            <label for="current_username" class="form-label">Current Username</label>
                            <input 
                                type="text" 
                                id="current_username" 
                                name="current_username" 
                                value={page.data.user?.username ?? ''} 
                                disabled 
                                class="form-input disabled" 
                            />
                        </div>

                        <div class="form-group">
                            <label for="username" class="form-label">New Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                required 
                                class="form-input"
                                placeholder="Enter new username"
                            />
                            
                            {#if form?.username_error}
                                <div class="error-message">
                                    <span class="error-icon">⚠</span>
                                    {form.username_error}
                                </div>
                            {/if}
                            {#if form?.username_success}
                                <div class="success-message">
                                    <span class="success-icon">✓</span>
                                    Username updated successfully!
                                </div>
                            {/if}
                        </div>

                        <button type="submit" class="primary-button">
                            Update Username
                        </button>
                    </form>
                </div>

                <!-- Password Settings Card -->
                <div class="settings-card">
                    <div class="card-header">
                        <h2>Password</h2>
                        <p class="card-description">Change your account password</p>
                    </div>
                    
                    <form method="POST" action="?/change_password" use:enhance class="settings-form">
                        <div class="form-group">
                            <label for="current_password" class="form-label">Current Password</label>
                            <input 
                                type="password" 
                                id="current_password" 
                                name="current_password" 
                                class="form-input" 
                                required 
                                placeholder="Enter current password"
                            />
                        </div>

                        <div class="form-group">
                            <label for="new_password" class="form-label">New Password</label>
                            <input 
                                type="password" 
                                id="new_password" 
                                name="new_password" 
                                class="form-input" 
                                required 
                                minlength="8"
                                placeholder="Enter new password (min. 8 characters)"
                            />
                        </div>

                        <div class="form-group">
                            <label for="confirm_password" class="form-label">Confirm New Password</label>
                            <input 
                                type="password" 
                                id="confirm_password" 
                                name="confirm_password" 
                                class="form-input" 
                                required 
                                placeholder="Confirm new password"
                            />
                        </div>

                        {#if form?.password_error}
                            <div class="error-message">
                                <span class="error-icon">⚠</span>
                                {form.password_error}
                            </div>
                        {/if}
                        {#if form?.password_success}
                            <div class="success-message">
                                <span class="success-icon">✓</span>
                                Password updated successfully!
                            </div>
                        {/if}

                        <button type="submit" class="primary-button">
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    .settings-wrapper {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .settings-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .settings-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 0.5rem 0;
    }

    .settings-subtitle {
        font-size: 1.1rem;
        color: var(--color-text-primary);
        opacity: 0.7;
        margin: 0;
    }

    .settings-grid {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        gap: 2rem;
    }

    .settings-card {
        background: var(--color-background-secondary);
        border: 2px solid var(--color-navigation-border);
        border-radius: 0.75rem;

        width: 60%;
        max-width: 480px;
        min-width: 320px;

        padding: 2rem;
        transition: all 0.3s ease;
    }

    .settings-card:hover {
        border-color: var(--color-blue-primary);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .card-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-navigation-border);
    }

    .card-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 0.5rem 0;
    }

    .card-description {
        font-size: 0.95rem;
        color: var(--color-text-primary);

        opacity: 0.7;
        margin: 0;
    }

    .settings-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-label {
        font-size: 0.9rem;
        font-weight: 500;
        
        color: var(--color-text-primary);
        margin-bottom: 0.25rem;
    }

    .form-input {
        padding: 0.875rem 1rem;
        border: 2px solid var(--color-navigation-border);
        background: var(--color-background-primary);
        color: var(--color-text-primary);
        
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.2s ease;
    }

    .form-input:focus {
        outline: none;
        border-color: var(--color-blue-primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--color-navigation-border);
    }

    .form-input::placeholder {
        color: var(--color-text-primary);
        opacity: 0.5;
    }

    .primary-button {
        padding: 0.875rem 1.5rem;
        margin-top: 0.5rem;
        
        background: var(--color-blue-primary);
        color: white;
        border: none;
        border-radius: 0.5rem;

        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        
        transition: all 0.2s ease;
    }

    .primary-button:hover {
        background: var(--color-blue-secondary);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .primary-button:active {
        transform: translateY(0);
    }

    .primary-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        
        transform: none;
        box-shadow: none;
    }

    .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        padding: 0.75rem 1rem;
        border-radius: 6px;
        
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid var(--color-red-primary);
        
        color: var(--color-red-primary);
        font-size: 0.9rem;
    }

    .success-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        padding: 0.75rem 1rem;
        background: rgba(34, 197, 94, 0.1);
        
        border: 1px solid #22c55e;
        border-radius: 6px;
        color: #16a34a;
        font-size: 0.9rem;
    }

    .error-icon,
    .success-icon {
        font-size: 1rem;
        font-weight: bold;
    }

    @media (max-width: 768px) {
        .settings-card {
            padding: 1.5rem;
        }

        .settings-header h1 {
            font-size: 2rem;
        }

        .settings-wrapper {
            padding: 1rem;
        }
    }

    @media (max-width: 480px) {
        .settings-card {
            padding: 1rem;
        }

        .form-input,
        .primary-button {
            padding: 0.75rem;
        }
    }
</style>