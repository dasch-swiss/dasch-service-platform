<script>
  import BurgerButton from "./BurgerButton.svelte";

  let visible = "hidden";

  function toggleVisible() {
    if (visible === "hidden") {
      visible = "visible"
    } else if (visible === "visible") {
      visible = "hidden"
    }
  }
</script>

<nav>
  <BurgerButton type="open" on:click={toggleVisible}></BurgerButton>
  <div class="menu" style="visibility: {visible}">
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
    padding: 16px 32px;
    height: calc(100vh - 32px);
    overflow-y: visible;
  }
</style>
