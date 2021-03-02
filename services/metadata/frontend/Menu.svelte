<script lang="ts">
  // import BurgerButton from "./BurgerButton.svelte";

  export let isVisible = false;

  function toggleVisible() {
    isVisible = !isVisible;
  }
</script>

<nav class="menu" class:hidden={!isVisible}>
  <slot />
  <!-- <BurgerButton type="open" on:click={toggleVisible}></BurgerButton>
  <div class="menu" style="visibility: {isVisible ? 'visible' : 'hidden'}">
    <BurgerButton type="close" on:click={toggleVisible}></BurgerButton>
    <ul>-->
    <!-- </ul>
  </div>  -->
</nav>

<style>
  .menu {
    background-color: var(--cl-background-light);
  }
  /* ul {
    list-style-type: none;
    margin: 0px;
    padding: 0px
  }
  :global(a) {
    padding: 20px;
    color: rgb(92, 92, 92) !important;
    text-decoration: none;
  }
  .menu {
    position: absolute;
    top: 0px;
    right: 0px;
    background-color: lightgray;
    box-sizing: border-box;
    padding: 16px 32px;
    height: 100vh;
    z-index: 10;
    overflow-y: visible;
    text-align: right;
  } */
</style>
