<script>
    let { mode = "", name = "", width = 20, height = 20, alt = "" } = $props()
</script>
  
<img src={`/icons/${mode}/${name}.svg`} {width} {height} {alt} />




  