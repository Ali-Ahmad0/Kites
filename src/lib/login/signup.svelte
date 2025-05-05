<script lang="ts">
    import { enhance } from "$app/forms";
    let { form } = $props();
</script>

<div class="content">
    <div class="card">
        <h1>Sign Up</h1>
        <form use:enhance={( {} ) => {
                return async ({ result, update }) => {
                    // Redirect to homepage
                    if (result.status === 200) {
                        window.location.href = "/login/signup/verify";
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
    </div>
</div>

<style>
    @import './login.css';
</style>
