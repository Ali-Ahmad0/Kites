<script lang="ts">
    export let data;
</script>

<ul>
    {#each data.kites as kite}
        <li>{kite.name}</li>
    {/each}
</ul>