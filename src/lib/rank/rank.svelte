<script lang="ts">
    import { Icon, Purchase } from "$lib"
    
    let { rank, price } = $props();
</script>

<div class="card">
    <div class="heading">
        <h2>{rank}</h2>
        <Icon mode={undefined} name={rank} width=36 height=36 alt="verified"/>
    </div>

    <p>Purchase to become a {rank} user</p>
    <Purchase rank={rank} price={price}/>
</div>

<style>
    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        
        margin: 0 auto;
        padding: 1.25rem 2.5rem;
        
        width: clamp(fit-content, 22vh);
        max-width: 480px;
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

    .heading {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .card h2 {
        margin: 0;
    }

    @keyframes spin {
        from { --angle: 0deg; }
        to { --angle: 360deg; }
    }
</style>