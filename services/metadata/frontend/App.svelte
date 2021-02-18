<script lang="ts">
  import Content from "./content/Content.svelte";
  
  const name = "DaSCH";
</script>

<style>
  .container {
    height: 95%;
  }
  h1 {
    text-align: center;
  }
</style>

<div class="container">
  <h1>The {name} future is never</h1>

  <Content/>
</div>