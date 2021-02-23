<script lang="ts">
  export let type = "open";
</script>

<div class="button" on:click>
  {#if type === "open"}
    <span class="line" />
    <span class="line" />
    <span class="line" />
    {:else}
    <span id="d1" class="line" />
    <span id="d2" class="line" />
  {/if}
</div>

<style>
  .button {
    height: 32px;
    width: 32px;
    border-radius: 3px;
    display: inline-block;
    cursor: pointer;
  }
  .button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .line {
    display: block;
    width: 26px;
    height: 5px;
    background-color: #333;
    margin: 4px 3px;
    border-radius: 3px;
  }
  #d1 {
    -webkit-transform: scale(1.1) rotate(-45deg) translate(-6px, 7px);
    transform: scale(1.1) rotate(-45deg) translate(-6px, 7px);
  }
  #d2 {
    -webkit-transform: scale(1.1) rotate(45deg) translate(1px, 0px);
    transform: scale(1.1) rotate(45deg) translate(1px, 0px);
  }
</style>
