<script lang="ts">
  import { getProject, currentProject } from "./store";
  import { onMount } from 'svelte';

  const projectID = window.location.pathname.split("/")[2];

  onMount(async () => {
      await getProject(projectID);
  });

</script>

<div class="projects">
  <div>
      <h1>Projects</h1>
  </div>
  <div class="list">
      <li>
        {$currentProject.shortCode}
      </li>
      <li>
        {$currentProject.shortName}
      </li>
      <li>
        {$currentProject.longName}
      </li>
      <li>
        {$currentProject.description}
      </li>
  </div>
</div>
