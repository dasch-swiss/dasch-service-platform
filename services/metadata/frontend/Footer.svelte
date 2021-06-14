<script lang="ts">
  import { onMount } from "svelte"

  let version: string

  onMount(async () => {
    await fetch(`${window.location.origin}/version.txt`)
      .then(response => response.text())
      .then((data) => {
        version = data
      })
  })
</script>

<footer>
  <div class="footer-container">
    {#if version}
      <div class=version>{`Version: v${version}`}</div>
    {/if}
    <div class=copyright>© 2021 DaSCH</div>
  </div>
</footer>

<style>
  footer {
    flex-shrink: 0;
    background-color: var(--cl-background);
    font-weight: bold;
    width: 100%;
    padding: 0.75rem;
    box-sizing: border-box;
    text-align: center;
  }
  .version {
    position: absolute;
    font-size: 0.75rem;
    line-height: 1.75;
  }
  @media screen and (min-width: 768px){
    footer {
      position: sticky;
      bottom: 0px;
      z-index: 1;
    }
  }
  @media screen and (min-width: 1200px) {
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
