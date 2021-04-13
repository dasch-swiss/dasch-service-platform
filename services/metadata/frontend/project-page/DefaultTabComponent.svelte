<script>  
  export let dataset;

  let isExpanded;

  const toggleExpand = () => {
    isExpanded = !isExpanded;
  }
  console.log(1, dataset)
</script>

<div class=properties>
{#if dataset}
<div class="property-row">
  <span class=label>Type of Data</span>
  <span class=data>{dataset?.content.typeOfData.join(', ')}</span>
</div>
<div class="property-row">
  <span class=label>Languages</span>
  <span class=data>{dataset?.content.language.join(', ')}</span>
</div>
{#if dataset.content.dateCreated}
<div class="property-row">
  <span class=label>Date Created</span>
  <span class=data>{dataset?.content.dateCreated}</span>
</div>
{/if}
{#if dataset.content.dateModified}
<div class="property-row">
  <span class=label>Date Modified</span>
  <span class=data>{dataset?.content.dateModified}</span>
</div>
{/if}
<div class="property-row">
  <span class=label>Access</span>
  <span class=data>{dataset?.content.conditionsOfAccess}</span>
</div>
<div class="property-row">
  <span class=label>Status</span>
  <span class=data>{dataset?.content.status}</span>
</div>
<div class="property-row">
  <span class=label>License</span>
  {#if Array.isArray(dataset?.content.license)}
  {#each dataset?.content.license as l}
  <a href={l.url} class=data target=_>CC {(`${l.url.split("/")[4]} ${l.url.split("/")[5]}`).toUpperCase()}</a>
  {/each}
  {/if}
</div>
{#if dataset?.content.documentation}
<div class="property-row">
  <span class=label>Additional documentation</span>
  <span class=data>{dataset?.content.documentation}</span>
</div>
{/if}
<div class="property-row">
  <span class=label>Abstract</span>
  <span class="data {isExpanded ? '' : 'abstract-short'}">{dataset?.content.abstract}</span>
</div>

<div on:click={toggleExpand} class=expand-button>show {isExpanded ? "less" : "more"}</div>

<div class="property-row">
  <span class=label>Attribution</span>
  {#if Array.isArray(dataset?.content.qualifiedAttribution)}
  {#each dataset?.content.qualifiedAttribution as a}
  <span class=data>{a.role}</span>
  {/each}
  {/if}
</div>
  <!-- {#each Object.entries(dataset.content) as [key, val]}
  <div class=property-row>
    {#if key === 'id' || key === 'type'}
    <span></span>
    {:else}
    <span class=label>{key}</span>
      {#if Array.isArray(val) && val.length > 1 && typeof val[0] === 'string'}
      <span class=data>{val.join(', ')}</span>
      {:else}
      <span class=data>{val}</span>
      {/if}
    {/if}
  </div>
  {/each} -->
{/if}
</div>

<style>
  a {
    color: var(--dasch-violet);
  }
  .property-row {
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap; */
    width: 100%;
  }
  .label, .data {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 2;
    margin-bottom: 10px;
    word-break: break-word;
  }
  .label {
    margin: 10px 0;
    flex: 1;
    font-weight: bold;
  }
  .abstract-short {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 45x;
  }
  .expand-button {
    background-image: linear-gradient(to right, #fff, var(--dasch-grey-3), #fff);
    color: var(--dasch-violet);
    text-align: center;
    font-size: 0.8em;
    padding: 2px 0;
    cursor: pointer;
  }
  @media screen and (min-width: 992px) {
    .property-row {
      /* flex-direction: row; */
    }
  }
</style>
