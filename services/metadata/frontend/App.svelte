<script lang="ts">
  import Content from "./content/Content.svelte";
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  
  const name = "DaSCH";
  let future: string;
</script>

<style>
  h1 {
    text-align: center;
  }
</style>

<Header/>
<div>
  <h1>The {name} future is {future}</h1>

  <Content/>
</div>
<Footer />
