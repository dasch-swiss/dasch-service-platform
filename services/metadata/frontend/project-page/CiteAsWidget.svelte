<script>
  export let projectMetadata;
</script>

<h3 class=widget-heading>Cite as</h3>
{#if projectMetadata}
  {#each projectMetadata.metadata as dataset}
    {#if dataset.type === 'http://ns.dasch.swiss/repository#Dataset'}
      <div>{dataset.howToCite}</div>
    {/if}
  {/each}
{/if}
