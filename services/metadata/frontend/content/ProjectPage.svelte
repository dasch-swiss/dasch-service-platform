<script lang="ts">
import { onMount } from "svelte";
import { link } from "svelte-navigator";
import type { Project } from "./interfaces";
import { currentProject } from "./stores";

export let id: string;
let project: Project;

onMount(async () => {
  currentProject.subscribe(p => project = p);

  if (!project) {
    await getProject();
    console.log(1);
  }
});

let getProject = async () => {
  const res = await fetch(`http://localhost:3000/projects/${id}`)
  project = await res.json();
}

</script>

<div>
  This is <strong>{project?.name}</strong> Project metadata page. Its ID is <strong>{project?.id}</strong>.
  
  <p><strong>Project description:</strong>{project?.description}</p>
  <a href="/" use:link>Get back to projects list</a>
</div>

<style>
  /* :global(.content-container){
    flex-direction: column;
  } */
</style>
