<script>
  export let project;
</script>

<h3 class=widget-heading>Datasets</h3>
{#if project}
  {#each project.metadata as dataset}
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
