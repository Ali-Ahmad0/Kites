<script lang="ts">
    import { enhance } from "$app/forms";
    let { form } = $props();
</script>

<div class="content">
    <div class="card">
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
        </form>
        <p>Don't have an account? <a href="/login/signup" class="other">Sign Up</a></p>             
    </div>
</div>

<style>
    @import './login.css';
</style>