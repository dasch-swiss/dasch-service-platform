<script lang="ts">
  import type { Project } from "../interfaces";
  
  export let project: Project;
</script>

<div class="properties">
  {#if project}
    {#each project.metadata as data}
      {#each Object.entries(data) as [label, d]}
        <div class=property-row>
          <span class=label>{label}</span>
          <span class=data>{d}</span>
        </div>
      {/each}
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
