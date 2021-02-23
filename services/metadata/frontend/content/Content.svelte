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
      <div class=category-container>
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
}
.content-container {
  display: flex;
  flex-direction: row;
  max-width: 1920px;
}
nav, main {
  /* float: left; */
  padding: 10px;
  min-height: 950px;
}
nav {
  /* width: 30%; */
  flex: 0 0 30%;
  /* background-color: hotpink; */
  display: flex;
  justify-content: center;
}
.category-container {
  /* background-color: lemonchiffon; */
  /* margin-top: 20px; */
  padding: 45px;
  max-width: 300px;
}
main {
  /* width: 70%; */
  width: 100%;
  /* background-color: aqua; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.tile-container {
  padding: 30px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  /* background-color: skyblue; */
  max-width: 1200px;
}
/* div:after {
  content: "";
  display: table;
  clear: both;
} */

@media screen and (max-width: 767px) {
  .content-container {
    flex-direction: column;
  }
  nav, main {
    width: 100%;
    min-height: auto;
  }
}
@media screen and (min-width: 768px) and (max-width: 1023px) { }
@media screen and (min-width: 1024px) and (max-width: 1365px) { }
@media screen and (min-width: 1366px) {}
</style>
