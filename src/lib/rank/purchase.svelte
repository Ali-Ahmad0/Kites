<script lang="ts">
	import { goto } from "$app/navigation";
    import { page } from "$app/state";
    
    let { rank, price } = $props();

    let is_purchasing = $state(false);

    async function purchase_rank(rank: string) {
        try {
            if (!page.data.authenticated) {
                goto('/login/signin');
                return;
            }

            is_purchasing = true;
            
            const response = await fetch('/api/user/rank', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rank: rank })
            });

            if (response.status === 200) {
                window.location.href = '/';
            } else {
                const data = await response.json();
                alert(data.error);
            }
            
        } catch (e) {
            console.log('[KITES | ERROR]: ', e);
        } finally {
            is_purchasing = false;
        }
    }
</script>

<button class="purchase" onclick={() => purchase_rank(rank)} disabled={is_purchasing}>
    { is_purchasing ? "Please Wait..." : `Purchase - ${price}` }
</button>

<style>
    .purchase {
        color: var(--color-text-primary);
        background-color: transparent;
        
        border-color: var(--color-navigation-border);
        border-radius: 0.5rem;
        
        padding: 0.5rem;
        margin: 0.5rem 0;
        font-size: 1.05rem;
        font-weight: bold;
    
        transition: all 0.2s ease;
    }

    .purchase:hover {
        border-color: var(--color-blue-secondary);
        transform: translateY(-2px);
    }

    .purchase:disabled {
        cursor: not-allowed;
    }
</style>