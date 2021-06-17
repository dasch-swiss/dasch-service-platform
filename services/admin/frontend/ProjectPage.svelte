<script lang="ts">
  import { getProject, currectProject } from "./store";
  import { onMount } from 'svelte';

  onMount(async () => {
      await getProject('8204c48c-be0c-43ae-bb7c-76ff64eb1882');
  });


</script>
<div class="projects">
  <div>
      <h1>Projects</h1>
  </div>
  <div class="list">
      <li>
        {$currectProject.shortCode}
      </li>
      <li>
        {$currectProject.shortName}
      </li>
      <li>
        {$currectProject.longName}
      </li>
      <li>
        {$currectProject.description}
      </li>
  </div>
</div>
