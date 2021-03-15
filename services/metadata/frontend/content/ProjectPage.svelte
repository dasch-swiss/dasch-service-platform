<script>
import { link } from "svelte-navigator";

let title = 'title';
let id = '0000';
let description = 'description';

</script>

<div>
  This is <strong>{title}</strong> Project metadata page. Its ID is <strong>{id}</strong>. It's about:
  <p>{description}</p>
  <a href="/" use:link>Get back to projects list</a>
</div>
<!-- <div>
  <a href="/" use:link>Get back to projects list</a>
</div> -->

<style>
  /* :global(.content-container){
    flex-direction: column;
  } */
</style>
