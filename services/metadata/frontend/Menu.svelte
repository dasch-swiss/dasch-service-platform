<script>
  import BurgerButton from "./BurgerButton.svelte";

  let isVisible = false;

  function toggleVisible(){
    isVisible = !isVisible;
  }

</script>

<nav>
  <BurgerButton type="open" on:click={toggleVisible}></BurgerButton>
  <div class="menu" style="visibility: {isVisible ? 'visible' : 'hidden'}">
    <BurgerButton type="close" on:click={toggleVisible}></BurgerButton>
    <ul>
      <slot />
    </ul>
  </div>
</nav>

<style>
  ul {
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
  }
</style>
