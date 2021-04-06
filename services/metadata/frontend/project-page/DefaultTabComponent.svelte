<script lang="ts">
  import { onMount } from "svelte";
  import type { Project } from "../interfaces";
  
  export let project: Project;
  export let activeTabLabel: string;

  onMount(() => {
    console.log(activeTabLabel)
    if (activeTabLabel === 'Attribution') {
      activeTabLabel = 'Person';
    }
  })
</script>

<div class=properties>
  {#if project}
    {#each project.metadata as data}
      {#if activeTabLabel === 'Person'}
        {#if data.type === `http://ns.dasch.swiss/repository#${activeTabLabel}`}
          {#each Object.entries(data) as [label, d]}
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
      {:else if data.type === `http://ns.dasch.swiss/repository#${activeTabLabel}`}
        {#each Object.entries(data) as [label, d]}
          <div class=property-row>
            <span class=label>{label}</span>
            <span class=data>{d}</span>
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
