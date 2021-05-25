<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from 'svelte/transition';
  import { handleSnackbar } from "./store";

  onMount(() => {
    if($handleSnackbar.isSnackbar) {
      setTimeout(() => {
        $handleSnackbar.isSnackbar = false;
      }, 3000);
    }
  });

  onDestroy(() => {
    if ($handleSnackbar.isSnackbar) {
      $handleSnackbar.isSnackbar = false;
    }
  })
</script>

<div in:fade={{duration: 250}}>
  {$handleSnackbar.message}
</div>

<style>
  div {
    position: fixed;
    min-width: 100%;
    text-align: center;
    padding: 20px 5px;
    color: #fff;
    background-color: var(--dasch-violet);
    z-index: 5;
    opacity: 0.95;
  }
  @media screen and (min-width: 768px) {
    div {
      left: 50%;
      min-width: 250px;
      margin-left: -165px;
      padding: 20px;
    }
  }
</style>
