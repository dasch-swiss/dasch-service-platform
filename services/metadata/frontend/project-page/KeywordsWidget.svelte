<script>
  export let projectMetadata;
</script>

<h3 class=widget-heading>Keywords</h3>
{#if projectMetadata}
  {#each projectMetadata.metadata as project}
    {#if project.type === 'http://ns.dasch.swiss/repository#Project'}
      {#each project.keywords as keyword}
        <span class="keyword">{keyword}</span>
        <span></span>
      {/each}
    {/if}
  {/each}
{/if}  

<style>
  .keyword {
    display: inline;
    border: 1px solid #cdcdcd;
    border-radius: 0.25rem;
    color: #fff;
    background-color: olivedrab;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    white-space: pre;
    line-height: 2em;
    padding: 5px 6px;
  }
</style>
