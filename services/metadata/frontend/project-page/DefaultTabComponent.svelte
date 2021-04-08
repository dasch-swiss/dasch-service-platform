<script lang="ts">  
  export let dataset: any;
</script>

<div class=properties>
{#if dataset}
  <!-- {#each datasets as data} -->
    {#each Object.entries(dataset.content) as [key, val]}
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
  <!-- {/each} -->
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
