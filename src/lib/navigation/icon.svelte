<script>
    let { mode, name, width, height, alt = ""} = $props()
</script>

{#if mode}
<img src={`/icons/${mode}/${name}.svg`} {width} {height} {alt} />

{:else}
<img src={`/icons/${name}.svg`} {width} {height} {alt} />
{/if}


  