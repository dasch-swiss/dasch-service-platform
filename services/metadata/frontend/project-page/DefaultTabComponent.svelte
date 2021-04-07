<script lang="ts">
  import { onMount } from "svelte";
  import type { ProjectMetadata } from "../interfaces";
  
  export let projectMetadata: ProjectMetadata;
  export let activeTabLabel: string;

  onMount(() => {
    console.log(activeTabLabel)
    if (activeTabLabel === 'Attribution') {
      activeTabLabel = 'Person';
    }
  })
</script>

<div class=properties>
{#if projectMetadata}
  {#each projectMetadata.metadata as metadata}
    {#if activeTabLabel === 'Person'}
      {#if metadata.type === `http://ns.dasch.swiss/repository#${activeTabLabel}`}
        {#each Object.entries(metadata) as [label, d]}
        <div class=property-row>
          {#if label === 'type'}
          <span class=label>Person</span>
          {:else if label === 'id'}
          <span></span>
          {:else}
          <span class=label>{label}</span>
          <span class=data>{d}</span>
          {/if}
        </div>
        {/each}
      {/if}
    {:else if metadata.type === `http://ns.dasch.swiss/repository#${activeTabLabel}`}
      {#each Object.entries(metadata) as [key, val]}
      <div class=property-row>
        {#if key === 'id' || key === 'type'}
        <span></span>
        {:else}
        <span class=label>{key}</span>
          {#if Array.isArray(val) && val.length > 1 && typeof val[0] === 'string'}
          <span class=data>{val.join(', ')}</span>
          {:else}
          <span class=data>{val}</span>
          {/if}
        <!-- <span class=label>{key}</span>
        <span class=data>{val}</span> -->
        {/if}

      </div>
      {/each}
    {/if}
  {/each}
{/if}
</div>

<style>
  .property-row {
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap; */
    width: 100%;
  }
  .label, .data {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 2;
    margin: 10px 0
  }
  .label {
    flex: 1;
    font-weight: bold;
  }
  @media screen and (min-width: 992px) {
    .property-row {
      flex-direction: row;
    }
  }
</style>
