<script lang="ts">
  import Content from "./content/Content.svelte";
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  
  const name = "DaSCH";
  let future: string;
</script>

<Header/>
<Content/>
<Footer/>
<!-- <div>
  <h1>The {name} future is {future}</h1>

  <Content/>
</div>
<Footer /> -->

<style>
  /* h1 {
    text-align: center;
  } */
  </style>
