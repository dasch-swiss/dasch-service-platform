<script lang="ts">
  import Content from "./content/Content.svelte";
  
  const name = "DaSCH";
  let future: string;
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
  <h1>The {name} future is {future}</h1>

  <Content/>
</div>
