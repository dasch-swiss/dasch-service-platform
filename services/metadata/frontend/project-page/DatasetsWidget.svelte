<script>
  export let projectMetadata;
</script>

<h3 class=widget-heading>Datasets</h3>
{#if projectMetadata}
  {#each projectMetadata.metadata as dataset}
    {#if dataset.type === 'http://ns.dasch.swiss/repository#Dataset'}
      <div>
        <input type=radio name={dataset.id}>
        <label for={dataset.id}>{dataset.title}</label>
      </div>
    {/if}
  {/each}
{/if}

<style>
  :global(h3.widget-heading) {margin-top: 6px}
</style>
