<script lang="ts">
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import Router from "svelte-spa-router";
  import routes from "./routes";
</script>

<Header/>

<div class=wrapper>
  <div class=content-container>
    <Router {routes} />
  </div>
</div>

<Footer/>

<style>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1 0 auto;
}
.content-container {
  display: flex;
  flex-direction: column;
  max-width: 1920px;
}
@media screen and (min-width: 992px) {
  .content-container {
    flex-direction: row;
  }
}
</style>
