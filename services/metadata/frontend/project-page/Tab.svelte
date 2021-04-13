<script lang="ts">
  import DefaultTabComponent from "./DefaultTabComponent.svelte";

  export let tabs = [] as any[];
  export let activeTabValue = 0;

  const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<ul>
{#each tabs as tab}
  <li class={activeTabValue === tab.value ? 'active' : ''}>
    <span on:click={handleClick(tab.value)}>{tab.label}</span>
  </li>
{/each}
</ul>
{#each tabs as tab}
	{#if activeTabValue === tab.value}
  <div class=box>
    <svelte:component this={DefaultTabComponent} dataset={tab}/>
  </div>
	{/if}
{/each}

<style>
  .box {
    margin-bottom: 10px;
    padding: 0 10px;
    /* border: 1px solid #dee2e6; */
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
