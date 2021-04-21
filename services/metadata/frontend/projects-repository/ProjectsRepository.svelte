<script lang='ts'>
  import Tile from './Tile.svelte';
  import Category from './Category.svelte';
  import { onMount } from 'svelte';
  import Pagination from './Pagination.svelte';
  import { getProjectsMetadata, pagedResults, resultsState } from '../stores';
  import { push } from 'svelte-spa-router';

  const defaultRoute = 'projects?_page=1&_limit=9'
  let message = 'Loading...';

  setTimeout(() => {
    const noData = 'No data retrived. Please check the connection and retry.';
    const noProject = 'No projects found.'
      message = $pagedResults && $pagedResults.length ? noData : noProject;
    }, 3000);
  
  onMount(async () => {
    if (!$pagedResults.length) {
      await getProjectsMetadata(1);
    }
    
    if (!$resultsState) {
      await push(`/${defaultRoute}`);
    } else {
      await push(`/${$resultsState}`);
    }
  });
</script>

<nav>
  <div class="category-container hidden m-inline-block">
    <Category />
  </div>
</nav>
<main>
  <div class=tile-container>
    {#if $pagedResults && $pagedResults.length}
      {#each $pagedResults as project}
        <Tile projectMetadata={project}/>
      {/each}
    {:else}
      <p>{message}</p>
    {/if}
  </div>
  {#if $pagedResults && $pagedResults.length}
    <Pagination />
  {/if}
</main>

<style>
* {
  box-sizing: border-box;
}
nav, main {
  width: 100%;
  min-height: auto;
  padding: 10px;
}
nav {
  flex: 0 0 20%;
  /* background-color: hotpink; */
  display: flex;
  justify-content: flex-end;
  padding: 0;
}
.category-container {
  /* background-color: lemonchiffon; */
  padding-top: 45px;
  max-width: 210px;
}
main {
  width: 100%;
  /* background-color: aqua; */
  align-items: center;
  justify-content: center;
}
.tile-container {
  padding: 40px 5px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  /* background-color: skyblue; */
  max-width: 1200px;
}
@media screen and (min-width: 992px) {
  nav, main {
    min-height: 950px;
  }
  nav {
    padding: 10px;
  }
  .tile-container {
    padding: 40px 0;
    min-width: 742px;
  }
}
@media screen and (min-width: 1200px) {
  .tile-container {
    min-width: 940px;
  }
}
@media screen and (min-width: 768px) and (max-width: 1023px) { }
@media screen and (min-width: 1024px) and (max-width: 1365px) { }
@media screen and (min-width: 1366px) {}
</style>
