<script lang="ts">
import Tile from "./Tile.svelte";
import Category from "./Category.svelte";
import { onMount } from "svelte";
import type { Project } from "./project.model";

let projects: Project[];
let message = 'Loading...';

setTimeout(() => {
  const noData = 'No data retrived. Please check the connection and retry.';
  const noProject = 'No projects found.'
    message = projects && projects.length ? noData : noProject;
  }, 3000);

onMount(async () => {
  await fetch('http://localhost:3000/projects')
    .then(r => r.json())
    .then(data => {
      projects = data;
    });
});
</script>

<div class=wrapper>
  <div class=content-container>
    <nav>
      <div class="category-container hidden m-inline-block">
        <Category bind:searched={projects} />
      </div>
    </nav>
    <main>
      <div class=tile-container>
        {#if projects && projects.length}
          {#each projects as project}
            <Tile name={project.name} description={project.description}/>
          {/each}
        {:else}
          <p>{message}</p>
        {/if}
      </div>
    </main>
  </div>
</div>

<style>
* {
  box-sizing: border-box;
}
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1 0 auto;
}
.content-container {
  display: flex;
  flex-direction: column;
  max-width: 1920px;
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
  .content-container {
    flex-direction: row;
  }
  nav, main {
    min-height: 950px;
  }
  nav {
    padding: 10px;
  }
}
@media screen and (min-width: 992px) {
  .tile-container {
    padding: 40px 0;
  }
}
@media screen and (min-width: 768px) and (max-width: 1023px) { }
@media screen and (min-width: 1024px) and (max-width: 1365px) { }
@media screen and (min-width: 1366px) {}
</style>
