<!-- <script lang="ts">
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
  
    // Load user data
    export let data;
  
    // Form handling
    let formData = {
      username: $page.data.user?.username || '',
      email: $page.data.user?.email || '',
      avatar: $page.data.user?.avatar || ''
    };
  </script>
  
  <section class="account-settings">
    <h1>Account Settings</h1>
    
    <form method="POST" use:enhance class="settings-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          bind:value={formData.username}
        />
      </div>
  
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          bind:value={formData.email}
        />
      </div>
  
      <div class="form-group">
        <label for="avatar">Avatar URL</label>
        <input 
          type="url" 
          id="avatar" 
          name="avatar" 
          bind:value={formData.avatar}
        />
        {#if formData.avatar}
          <img src={formData.avatar} alt="Profile" class="avatar-preview" />
        {/if}
      </div>
  
      <button type="submit" class="save-button">Save Changes</button>
    </form>
  </section>
  
  <style>
    .account-settings {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1.5rem;
      background: var(--color-background-secondary);
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
  
    input {
      padding: 0.75rem;
      border-radius: 4px;
      border: 1px solid var(--color-navigation-border);
      background: var(--color-background-primary);
      color: var(--color-text-primary);
    }
  
    .avatar-preview {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-top: 0.5rem;
    }
  
    .save-button {
      padding: 0.75rem 1.5rem;
      background: var(--color-blue-primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      align-self: flex-start;
    }
  </style> -->