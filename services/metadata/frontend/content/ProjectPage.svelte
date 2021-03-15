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
  }
});

let getProject = async () => {
  const res = await fetch(`http://localhost:3000/projects/${id}`)
  project = await res.json();
}

</script>

<div class=container>
  <div>ID: {project?.id}</div>
  <div>Title: {project?.name}</div>
  <div>Description:</div>
  <p>{project?.description}</p>
  <div>
    <a href="/" use:link>Get back to projects list</a>
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
