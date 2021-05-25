<script>
  // TODO: once releae-please-action is configured to change version in package.json take it from there
  const version = '1.0.0';
</script>

<footer>
  <div>Copyright © 2021 DaSCH</div>
  <!-- <div class=version>{`dasch-service-platform v.${version}`}</div> -->
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
    font-size: 0.75rem;
    color: var(--dasch-violet);
  }
  @media screen and (min-width: 768px){
    footer {
      position: sticky;
      bottom: 0px;
      z-index: 1;
    }
  }
</style>
