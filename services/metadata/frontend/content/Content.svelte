<script lang="ts">
import Tile from "./Tile.svelte";
import Category from "./Category.svelte";
import { onMount } from "svelte";
import type { PaginationData, Project } from "./interfaces";
import Pagination from "./Pagination.svelte";
import { getProjects, pagedResults, pages } from "./stores";

let projects: Project[];
let message = 'Loading...';
let pagination: PaginationData;

setTimeout(() => {
  const noData = 'No data retrived. Please check the connection and retry.';
  const noProject = 'No projects found.'
    message = projects && projects.length ? noData : noProject;
  }, 3000);
 
onMount(async () => {
  await getProjects(1);

  pagedResults.subscribe(r => projects = r);

  pages.subscribe(p => pagination = p);
});
</script>

<nav>
  <div class="category-container hidden m-inline-block">
    <Category bind:searched={projects} />
  </div>
</nav>
<main>
  <div class=tile-container>
    {#if projects && projects.length}
      {#each projects as project}
        <Tile project={project}/>
      {/each}
    {:else}
      <p>{message}</p>
    {/if}
  </div>
  {#if projects && projects.length}
    <Pagination pagination={pagination} />
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
