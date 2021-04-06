<script>
  export let project;
</script>

<h3 class=widget-heading>Cite as</h3>
{#if project}
  {#each project.metadata as dataset}
    {#if dataset.type === 'http://ns.dasch.swiss/repository#Dataset'}
      <div>{dataset.howToCite}</div>
    {/if}
  {/each}
{/if}
