<script>
    let { mode, name, width, height, alt = "" } = $props()
</script>
  
<img src={`/icons/${mode}/${name}.svg`} {width} {height} {alt} />




  