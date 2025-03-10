<script lang="ts">
    import { enhance } from "$app/forms";
    let { signin, form } = $props();
</script>

<div class="content">
    <div class="card">
        {#if signin}
            <h1>Sign In</h1>
            <form use:enhance={( {} ) => {
                    return async ({ result, update }) => {
                        // Redirect to homepage
                        if (result.status === 200) {
                            window.location.href = "/main/home";
                        }

                        await update();
                    };
                }} method="POST" action="?/login">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="example@gmail.com" required>
                    {#if form?.email?.invalid}
                        <span class="error">{form.email.message}</span>
                    {/if}
                </div>
                
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Password" required>
                    {#if form?.password?.invalid}
                        <span class="error">{form.password.message}</span>
                    {/if}
                </div>
                
                <button class="confirm">Sign In</button>
                <button class="google" formaction="?/google">
                    Sign In with Google
                </button>
            </form>
            <p>Don't have an account? <a href="/login/signup" class="other">Sign Up</a></p>
        
        {:else}
            <h1>Sign Up</h1>
            <form use:enhance={( {} ) => {
                    return async ({ result, update }) => {
                        // Redirect to homepage
                        if (result.status === 200) {
                            window.location.href = "/main/home";
                        }

                        await update();
                    };
                }} method="POST" action="?/signup">
                <div class="form-group">
                    <label for="name">Username:</label>
                    <input type="name" id="name" name="name" placeholder="Use letters, numbers, _ , - only " required>
                    {#if form?.username?.invalid}
                        <span class="error">{form.username.message}</span>
                    {/if}
                </div>
                
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="example@gmail.com" required>
                    {#if form?.email?.invalid}
                        <span class="error">{form.email.message}</span>
                    {/if}
                </div>
                
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter a strong password" required>
                    {#if form?.password?.invalid}
                        <span class="error">{form.password.message}</span>
                    {/if}
                </div>
                
                <div class="form-group">
                    <label for="confirm_password">Confirm Password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" placeholder="Re-enter your password" required>
                    {#if form?.confirm_password?.invalid}
                        <span class="error">{form.confirm_password.message}</span>
                    {/if}
                </div>
                
                <button class="confirm">Sign Up</button>
            </form>
            <p>Already have an account? <a href="/login/signin" class="other">Sign In</a></p>                
        {/if}
    </div>
</div>

<style>
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        
        height: 97vh;
        
        animation: show 0.6s ease-out;
    }

    @keyframes show {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    h1 {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        
        text-align: center;
    }

    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        
        margin: 0 auto;
        padding: 1.25rem 2.5rem;
        
        width: 22vw;
        max-width: 420px;
        min-width: 280px;
        height: fit-content;
        
        background-color: var(--color-background-primary);
        
        border-radius: 1.25rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    
    }

    @property --angle {
        syntax: "<angle>";
        initial-value: 0deg;
        inherits: false;
    }

    .card::after, .card::before {
        content: '';
        
        position: absolute;
        top: -0.125rem;
        left: -0.125rem;
        width: calc(100% + 0.25rem);
        height: calc(100% + 0.25rem);
        
        background-image: conic-gradient(from var(--angle), #2bffba, #5b6ef3, #2bffba);
        z-index: -1;
        
        border-radius: 1.375rem;
        
        animation: spin 3s linear infinite;
    }

    .card::before {
        filter: blur(1.5rem);
        opacity: 0.25;
    }

    @keyframes spin {
        from { --angle: 0deg; }
        to { --angle: 360deg; }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        color: var(--color-text-secondary);
        font-size: 0.9rem;
        font-weight: 500;
        margin-left: 0.25rem;
    }

    input {
        padding: 0.75rem 1rem;
        background-color: var(--color-background-primary);
        color: var(--color-text-secondary);
        border: 1.5px solid var(--color-blue-secondary);
        border-radius: 0.75rem;
        font-family: inherit;
        font-size: 0.95rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    input:focus {
        outline: none;
        border-color: var(--color-blue-primary);
        box-shadow: 0 0 0 2px rgba(91, 110, 243, 0.2);
    }

    .confirm, .google { 
        margin-top: 0.75rem;
        padding: 0.75rem 1rem;
        font-family: inherit;  
        font-size: 0.95rem;
        font-weight: 600;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .confirm {
        border: none;
        background-color: var(--color-blue-primary);
        color: var(--color-text-primary);
    }

    .google {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background-color: transparent;
        color: var(--color-text-secondary);
        border: 1.5px solid var(--color-blue-primary);
        margin-top: 0.75rem;
    }

    .confirm:hover {
        background-color: var(--color-blue-secondary);
        
        transform: translateY(-2px);
        
        box-shadow: 0 4px 12px rgba(91, 110, 243, 0.2);
    }

    .confirm:active {
        transform: translateY(0);
    }

    .google:hover {
        color: var(--color-text-primary);
        border-color: var(--color-blue-secondary);
        
        transform: translateY(-2px);
        
        box-shadow: 0 4px 12px rgba(91, 110, 243, 0.1);
    }

    .google:active {
        transform: translateY(0);
    }

    p {
        text-align: center;
        font-size: 0.9rem;
        
        margin-top: 1.5rem;
        
        color: var(--color-text-secondary);
    }

    .other {
        color: var(--color-blue-primary);
        
        font-weight: bold;
        text-decoration: none;
        
        transition: color 0.2s ease;
    }

    .other:hover {
        color: var(--color-blue-secondary);
        text-decoration: underline;
    }

    .error {
        color: #f73b3b;
        
        font-size: 0.8rem;
        margin-top: 0.25rem;
        margin-left: 0.25rem;
    }

    @media (max-width: 768px) {
        .card {
            padding: 1.25rem 1.75rem;
        }
    }
</style>