<script lang="ts">
  import type { ProjectMetadata } from "../interfaces";

  export let projectMetadata: ProjectMetadata;
  export let tabs = [] as any[];
  export let activeTabLabel = 'Project';

  const handleClick = (tabValue: any) => () => (activeTabLabel = tabValue);
</script>

<ul>
  {#each tabs as tab}
    <li class={activeTabLabel === tab.label ? 'active' : ''}>
      <span on:click={handleClick(tab.label)}>{tab.label}</span>
    </li>
  {/each}
</ul>
{#each tabs as tab}
	{#if activeTabLabel === tab.label}
    <div class=box>
      <svelte:component this={tab.component} {projectMetadata} {activeTabLabel}/>
    </div>
	{/if}
{/each}

<style>
  .box {
    margin-bottom: 10px;
    padding: 40px;
    border: 1px solid #dee2e6;
    border-radius: 0 0 .5rem .5rem;
    border-top: 0;
    overflow-wrap: break-word;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    margin-bottom: -1px;
  }
  span {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }
  li.active > span {
    color: #fff;
    background-color: var(--dasch-violet);
    border-color: #dee2e6 #dee2e6 #fff;
  }
</style>
