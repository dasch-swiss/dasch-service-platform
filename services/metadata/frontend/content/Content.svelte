<script lang="ts">
import Tile from "./Tile.svelte";
import { ProjectService } from "./project-service";
import Category from "./Category.svelte";
import { onMount } from "svelte";
import type { Project } from "./project.model";

let projectService = new ProjectService();
let projects: Project[];
let categories = projectService.getCategories();
let message = 'Loading...';

setTimeout(() => {
    message = 'No data retrived. Please check the connection and retry.';
  }, 3000);

onMount(async () => {
  await fetch(' http://localhost:3000/projects')
    .then(r => r.json())
    .then(data => {
      console.log(data);
      projects = data;
    });
});
</script>

<style>
* {
  box-sizing: border-box;
}

nav, main {
  float: left;
  padding: 10px;
  height: 600px;
}

nav {
  width: 30%;
  background-color: hotpink;
}

.category-container {
  margin-top: 20px;
  padding: 0 10px 10px;
}

main {
  width: 70%;
  background-color: aqua;
  display: flex;
  align-items: center;
}

.tile-container {
  padding: 30px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  background-color: skyblue;
  flex: 1;
}

div:after {
  content: "";
  display: table;
  clear: both;
}

@media screen and (max-width: 600px) {
  nav, main {
      width: 100%;
  }
}
</style>

<div>
  <nav>
    <div class="category-container">
      {#each categories as { name }}
        <Category categoryName={name}/>
      {/each}
    </div>
  </nav>
  <main>
    <div class="tile-container">
      {#if projects}
        {#each projects as project}
          <Tile name={project.name} description={project.description}/>
        {/each}
      <!-- {/if} -->
      {:else}
        <p>{message}</p>
      {/if}
    </div>
  </main>
</div>
