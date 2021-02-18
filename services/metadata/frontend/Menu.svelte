<script>
  let visible = "hidden";
  // let visible = "visible";
  import BurgerButton from "./BurgerButton.svelte";
</script>

<nav>
  <BurgerButton></BurgerButton>
  <div class="menu" style="visibility: {visible}">
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
    padding: 32px;
    /* display: block; */
    height: 200vh;
    overflow-y: visible;
  }
</style>
