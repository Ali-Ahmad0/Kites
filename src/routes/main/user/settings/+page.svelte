<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { is_dark_mode } from '$lib';

  // Form states
  let newUsername = $state('');
  
  // Password change state
  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');
  
  // Theme management
  let mode = $state("dark_mode_icons");
  $effect(() => {
    mode = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
  });

  // Clear form fields after successful submission
  $effect(() => {
    if ($page.form?.action === '?/updateUsername' && $page.status === 303) {
      newUsername = '';
    }
    if ($page.form?.action === '?/changePassword' && $page.status === 303) {
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
    }
  });
</script>

<div class="app-layout">
  <main class="content">
    <section class="settings-container">
      <h2>Account Settings</h2>
      
      <!-- Success Message (for both forms) -->
      {#if $page.status === 303 && $page.url.pathname === '/user/settings'}
        <p class="success-text">
          {#if $page.form?.action === '?/updateUsername'}
            Username updated successfully!
          {:else if $page.form?.action === '?/changePassword'}
            Password updated successfully!
          {/if}
        </p>
      {/if}

      <!-- Username Update Form -->
      <form method="POST" action="?/updateUsername" use:enhance class="settings-form">
        <div class="form-group">
          <label for="currentUsername">Current Username</label>
          <input 
            type="text" 
            id="currentUsername"
            value={$page.data.user?.username} 
            disabled
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label for="newUsername">New Username</label>
          <input
            type="text"
            id="newUsername"
            name="username"
            bind:value={newUsername}
            class="input-field"
          />
          {#if $page.form?.action === '?/updateUsername' && $page.form?.data?.usernameError}
            <p class="error-text">{$page.form.data.usernameError}</p>
          {/if}
        </div>

        <button 
          type="submit" 
          class="save-button"
          disabled={!newUsername.trim()}
        >
          Update Username
        </button>
      </form>

      <!-- Password Change Form -->
      <div class="section-divider"></div>
      
      <h3>Change Password</h3>
      <form method="POST" action="?/changePassword" use:enhance class="settings-form" >
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            bind:value={currentPassword}
            class="input-field"
            required
          />
        </div>

        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            bind:value={newPassword}
            class="input-field"
            required
            minlength="8"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            bind:value={confirmPassword}
            class="input-field"
            required
          />
        </div>

        {#if $page.form?.action === '?/changePassword' && $page.form?.data?.passwordError}
          <p class="error-text">
            {#if $page.form.data.passwordError === 'New passwords do not match'}
                ✗ Passwords don't match. Please re-enter carefully.
            {:else}
                {$page.form.data.passwordError}
            {/if}
          </p>
        {/if}

        <button 
          type="submit" 
          class="save-button"
          disabled={!currentPassword || !newPassword || !confirmPassword}
        >
          Change Password
        </button>
      </form>
    </section>
  </main>
</div>

<style>
  .section-divider {
    height: 1px;
    background: var(--color-navigation-border);
    margin: 2rem 0;
  }
  
  .settings-container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-blue-primary);
    border-radius: 8px;
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

  .input-field {
    padding: 0.75rem;
    border: 1px solid var(--color-navigation-border);
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    border-radius: 4px;
  }

  .save-button {
    padding: 0.75rem;
    background: var(--color-blue-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .save-button:hover:not(:disabled) {
    background: var(--color-blue-secondary);
  }

  .save-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error-text {
    color: var(--color-red-primary);
    font-size: 0.9rem;
  }

  .success-text {
    color: var(--color-blue-primary);
    margin-bottom: 1.5rem;
    text-align: center;
  }
</style>