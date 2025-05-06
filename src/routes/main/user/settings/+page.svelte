<script lang="ts">
    import { enhance } from "$app/forms";
	  import { page } from "$app/state";
    let { form } = $props();

    if (!page.data.user) {
        window.location.href = '/login/signin';
    }
</script>

<div class="app-layout">
  <main class="content">
      <section class="settings-container">
          <h2>Account Settings</h2>

          <!-- Update username form -->
          <h3>Change Username</h3>
          <form method="POST" action="?/update_username" use:enhance class="settings-form">
              <div class="form-group">
                  <label for="current_username">Current Username</label>
                  <input type="text" id="current_username" name="current_username" value={page.data.user?.username ?? ''} disabled class="input-field" />
              </div>

              <div class="form-group">
                  <label for="username">New Username</label>
                  <input type="text" id="username" name="username" required class="input-field" />
                  
                  {#if form?.username_error}
                      <span class="error-text">{form.username_error}</span>
                  {/if}
                  {#if form?.username_success}
                      <p class="success-text">Username updated!</p>
                  {/if}
              </div>

              <button type="submit" class="save-button">Update Username</button>
          </form>

          <div class="section-divider"></div>

          <!-- Change password form -->
          <h3>Change Password</h3>
          <form method="POST" action="?/change_password" use:enhance class="settings-form">
              <div class="form-group">
                  <label for="current_password">Current Password</label>
                  <input type="password" id="current_password" name="current_password" class="input-field" required />
              </div>

              <div class="form-group">
                  <label for="new_password">New Password</label>
                  <input type="password" id="new_password" name="new_password" class="input-field" required minlength="8" />
              </div>

              <div class="form-group">
                  <label for="confirm_password">Confirm New Password</label>
                  <input type="password" id="confirm_password" name="confirm_password" class="input-field" required />
              </div>

              {#if form?.password_error}
                  <p class="error-text">{form.password_error}</p>
              {/if}
              {#if form?.password_success}
                  <p class="success-text">Password updated!</p>
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
        max-width: 640px;
        min-width: 480px;
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
    
</style>
