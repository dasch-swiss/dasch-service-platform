<script>
  import { currentProjectMetadata } from "../stores";
</script>

<h3 class=widget-heading>Cite as</h3>
{#if $currentProjectMetadata}
  {#each $currentProjectMetadata.metadata as dataset}
    {#if dataset.type === 'http://ns.dasch.swiss/repository#Dataset'}
      <div>{dataset.howToCite}</div>
    {/if}
  {/each}
{/if}
