<script>
  export let project;
</script>

<h3>Datasets</h3>
{#if project}
  {#each project.metadata as dataset}
    {#if dataset.type === 'http://ns.dasch.swiss/repository#Dataset'}
    <input type=radio name={dataset.id}>
    <label for={dataset.id}>{dataset.title}</label>
    {/if}
  {/each}
{/if}
