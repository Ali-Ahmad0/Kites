<script>
    let { mode: folder, name, width, height, alt = ""} = $props()
</script>
  
<img src={`/icons/${folder}/${name}.svg`} {width} {height} {alt} />




  