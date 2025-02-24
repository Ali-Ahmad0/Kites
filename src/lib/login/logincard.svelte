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
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="example@gmail.com" required>
                {#if form?.email?.invalid}
                    <span class="error">{form.email.message}</span>
                {/if}
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                {#if form?.password?.invalid}
                    <span class="error">{form.password.message}</span>
                {/if}
                <button class="confirm">Sign In</button>
                <button class="google" formaction="?/google">Sign In with Google</button>
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
                <label for="name">Username:</label>
                <input type="name" id="name" name="name" placeholder="John Smith" required>
                {#if form?.username?.invalid}
                    <span class="error">{form.username.message}</span>
                {/if}
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="example@gmail.com" required>
                {#if form?.email?.invalid}
                    <span class="error">{form.email.message}</span>
                {/if}
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="enter a strong password" required>
                {#if form?.password?.invalid}
                    <span class="error">{form.password.message}</span>
                {/if}
                <label for="confirm password">Confirm Password:</label>
                <input type="password" id="confirm_password" name="confirm_password" placeholder="re-enter your password" required>
                {#if form?.confirm_password?.invalid}
                    <span class="error">{form.confirm_password.message}</span>
                {/if}
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
        height: 100vh;
        animation: show 1s;
    }

    @keyframes show {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    h1 {
        margin-top: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        padding: 2rem;
        width: 20vw;
        max-width: 400px;
        min-width: 250px;
        height: fit-content;
        background-color: var(--color-background-secondary);
        border-radius: 1rem;
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
        background-image: conic-gradient(from var(--angle), #2bcbba, #5b6ef3, #2bcbba);
        z-index: -1;
        border-radius: 1.125rem;
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

    label {
        color: var(--color-text-secondary);
    }

    input {
        padding: 0.25rem 0.5rem;
        background-color: var(--color-background-primary);
        border-radius: 0.5rem;
        border-color: var(--color-blue-secondary);
        font-family: inherit;
        color: var(--color-text-secondary);
    }

    .confirm, .google { 
        margin-top: 1.2rem;
        padding: 0.35rem 1rem;
        font-family: inherit;  
        font-size: 0.85rem;
        font-weight: bold;
        border-radius: 0.5rem;
        transition: background-color 0.3s ease;
    }

    .confirm {
        border: none;
        background-color: var(--color-blue-primary);
        color: var(--color-text-primary);
    }

    .google {
        background-color: var(--color-background-secondary);
        color: var(--color-text-secondary);
    }

    .confirm:hover {
        background-color: var(--color-blue-secondary);
    }

    .google {
        color: var(--color-text-primary);
        border-color: var(--color-blue-primary);
        margin-top: 0.5rem;
        transition: color 0.3s ease, border-color 0.3s ease;
    }

    .google:hover {
        color: var(--color-text-secondary);
        border-color: var(--color-blue-secondary);
    }

    p, .other {
        text-align: center;
        font-size: 0.85rem;
        margin-top: 1rem;
        color: var(--color-text-secondary);
        background-color: var(--color-background-secondary);
        border: none;
    }

    .other {
        transition: color 0.3s ease;
    }

    .other:hover {
        color: var(--color-text-primary);
    }

    .error {
        color: #f73b3b;
        font-size: 0.75rem;
    }
</style>