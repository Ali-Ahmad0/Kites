<script lang="ts">
  import { enhance } from "$app/forms";
  let { data,form } = $props();
  const user = data.user;
</script>

<div class="app-layout">
  <main class="content">
    <section class="settings-container">
      <h2>Account Settings</h2>

      <!-- Username Update Form -->
      <form method="POST" action="?/updateUsername" use:enhance class="settings-form">
        <div class="form-group">
          <label for="currentUsername">Current Username</label>
          <input type="text" id="currentUsername" name="currentUsername" value={data.user?.username ?? ''} disabled class="input-field" />
        </div>

        <div class="form-group">
          <label for="username">New Username</label>
          <input type="text" id="username" name="username" required class="input-field" />
         
          {#if form?.usernameError}
            <span class="error-text">{form.usernameError}</span>
          {/if}
          {#if form?.usernameSuccess}
            <p class="success-text">Username updated!</p>
          {/if}

        </div>

        <button type="submit" class="save-button">Update Username</button>
      </form>

      <div class="section-divider"></div>

      <h3>Change Password</h3>
      <form method="POST" action="?/changePassword" use:enhance class="settings-form">
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input type="password" id="currentPassword" name="currentPassword" class="input-field" required />
        </div>

        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input type="password" id="newPassword" name="newPassword" class="input-field" required minlength="8" />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" class="input-field" required />
        </div>

        {#if form?.passwordError}
          <p class="error-text"> {form.passwordError} </p>
        {/if}
        {#if form?.passwordError} 
          <p class="error-text"> {form.passwordError} </p>
        {/if}

        <button type="submit" class="save-button">Change Password</button>
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

  .save-button:hover {
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
  
  @media (max-width: 600px) {
  .settings-container {
    width: 100% !important;
    max-width: 100% !important;
    margin: 2rem 0rem !important;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    box-sizing: border-box !important;
  }
}
</style>
