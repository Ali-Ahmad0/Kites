<script lang="ts">
	import { goto } from "$app/navigation";

    let otp_input: Array<number> = $state([]);

    let error_message: string = $state('');
    let is_loading: boolean = $state(false);

    // Handle OTP input auto-focus
    function handle_input(e: Event, nextId?: string) {
        const target = e.target as HTMLInputElement;
        if (target.value.length >= 1 && nextId) {
            document.getElementById(nextId)?.focus();
        }

        error_message = '';
    }

    async function validate() {
        if (!(otp_input.length === 6 && otp_input.every(digit => digit !== undefined && digit !== null))) {
            return;
        }

        try {
            is_loading = true;
            error_message = '';
            
            // Get the OTP input as a string
            let otp = '';
            for (let i = 0; i < 6; i++) {
                otp += otp_input[i].toString();
            }

            // API request to verify OTP
            const response = await fetch('/api/otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    otp: otp
                })
            });

            if (response.status === 200) {
                window.location.href = "/main/home";
            }

            else if (response.status === 400) {
                error_message = "OTP is invalid"
            }

            else if (response.status === 401) {
                goto('/login/signup');
            }
        
        } catch (e) {
            console.error('[KITES | ERROR]: ', e);
            alert("Internal Server Error");

        } finally {
            is_loading = false;
        }
    }

    async function resend() {
        try {
            const response = await fetch('/api/otp/resend', { method: "POST" });
            
        } catch(e) {

        }
    }

</script>

<div class="content">
    <div class="card">
        <h1>Verify Your Email</h1>
        <p class="subtext">We've sent a 6-digit code to your email</p>
        <div class="otp-container">
            {#each Array(6) as _, i}
                <input
                    type="text"
                    id={`otp-${i}`}
                    name={`otp-${i}`}
                    maxlength="1"
                    pattern="\d"
                    bind:value={otp_input[i]}
                    required
                    oninput={(e) => handle_input(e, i < 5 ? `otp-${i+1}` : undefined)}
                    onkeydown={(e) => {
                        if (e.key === 'Backspace' && !(e.target as HTMLInputElement).value && i > 0) {
                            document.getElementById(`otp-${i-1}`)?.focus();
                        }
                    }}
                />
            {/each}
        </div>

        {#if error_message}
            <div class="error-message">
                {error_message}
            </div>
        {/if}

        <button 
            class="confirm" onclick={validate}
            disabled={!(otp_input.length === 6 && otp_input.every(digit => digit !== undefined && digit !== null))}
        >
            {#if is_loading}
                Verifying...
            {:else}
                Verify
            {/if}
        </button>
        
        <p class="resend">
            Didn't receive a code? 
            <button onclick={resend} class="other">Resend</button>
        </p>
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

    h1 {
        margin-top: 0.5rem;
        margin-bottom: 0.25rem;
        text-align: center;
    }

    .subtext {
        text-align: center;
        color: var(--color-text-secondary);
        
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
    }

    .otp-container {
        display: flex;
        justify-content: space-between;
        
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    .otp-container input {
        width: 2.5rem;
        height: 3rem;
        
        text-align: center;
        font-size: 1.25rem;
        font-weight: 600;
        
        padding: 0;
        border: 1.5px solid var(--color-blue-secondary);
        border-radius: 0.5rem;
        
        background-color: var(--color-background-primary);
        color: var(--color-text-primary);
        
        transition: all 0.2s ease;
    }

    .otp-container input:focus {
        outline: none;        
        border-color: var(--color-blue-primary);
        transform: translateY(-1px);
    }

    .error-message {
        color: #ff4d4f;

        padding: 0.75rem;
        margin-bottom: 1rem;

        border-radius: 0.5rem;
        text-align: center;

        font-size: 0.9rem;
    }

    .confirm {
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        
        width: 100%;
        
        font-family: inherit;
        font-size: 0.95rem;
        font-weight: 600;

        border: none;        
        border-radius: 0.75rem;
        
        cursor: pointer;

        background-color: var(--color-blue-primary);
        color: var(--color-text-primary);
        
        transition: all 0.2s ease;
    }

    .confirm:hover {
        background-color: var(--color-blue-secondary);
        transform: translateY(-2px);
    }

    .confirm:active {
        transform: translateY(0);
    }

    .confirm:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .resend {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 1rem;
        color: var(--color-text-secondary);
    }

    .other {
        color: var(--color-blue-primary);
        background-color: transparent;
        
        border: none;        
        font-weight: bold;

        transition: color 0.2s ease;
    }

    .other:hover {
        color: var(--color-blue-secondary);
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .card {
            padding: 1.25rem 1.75rem;
        }
        
        .otp-container {
            gap: 0.5rem;
        }
        
        .otp-container input {
            width: 2rem;
            height: 2.5rem;
            font-size: 1rem;
        }
    }
</style>