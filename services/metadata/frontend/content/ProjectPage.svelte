<script lang="ts">
import { onMount } from "svelte";
import type { Project } from "./interfaces";
import { currentProject } from "./stores";

  export let id: string;
  let project: Project;

  onMount(async () => {
    if (!id) {
      const url = window.location.hash;
      const lastItem = url.substring(url.lastIndexOf('/') + 1)
      id = lastItem;
      await getProject();
    } else {
      currentProject.subscribe(p => project = p);
      if (!project) {
        await getProject();
      }
    }
  });
  
  let getProject = async () => {
    const res = await fetch(`http://localhost:3000/projects/${id}`)
    project = await res.json();
  }
</script>
  
<div class="container">
  <div>ID: {project?.id}</div>
  <div>Title: {project?.name}</div>
  <div>Description:</div>
  <p>{project?.description}</p>
  <div>
    <a href="/">Get back to projects list</a>
  </div>
</div>

<style>
  .container {
    padding: 40px;
    display: block;
    max-width: 1200px;
  }
  a {
    color: var(--dasch-violet);
  }
</style>
