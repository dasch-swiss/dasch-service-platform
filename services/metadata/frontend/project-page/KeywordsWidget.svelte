<script>
  export let project;
</script>

<h3>Keywords</h3>
{#if project}
  {#each project.metadata as project}
    {#if project.type === 'http://ns.dasch.swiss/repository#Project'}
      {#each project.keywords as keyword}
        <span class="keyword">{keyword}</span>
      {/each}
    {/if}
  {/each}
{/if}  

<style>
  .keyword {
    display: inline;
    color: #fff;
    background-color: olivedrab;
    border: 1px solid #cdcdcd;
    border-radius: 3px;
    line-height: 2em;
    padding: 5px 6px;
  }
</style>
