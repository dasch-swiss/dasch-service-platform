<script lang="ts">
  import Content from "./content/Content.svelte";
  
  const name = "DaSCH";
  let future: string;
</script>

<style>
  h1 {
    text-align: center;
  }
</style>

<div>
  <h1>The {name} future is {future}</h1>

  <Content/>
</div>
