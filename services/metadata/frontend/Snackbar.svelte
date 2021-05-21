<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';
  import { isSnackbar } from "./store";

  let message = 'Citation copied succesfully!';

  onMount(() => {
    setTimeout(() => {
      $isSnackbar = !$isSnackbar;
    }, 5000);
  });
</script>

  <div transition:fade={{duration: 250}}>
    {message}
  </div>

<style>
  div {
    position: fixed;
    min-width: 100%;
    text-align: center;
    padding: 20px;
    color: #fff;
    background-color: var(--dasch-violet);
  }
  @media screen and (min-width: 576px) {
    div {
      left: 50%;
      min-width: 250px;
      margin-left: -125px;
    }
  }
</style>
