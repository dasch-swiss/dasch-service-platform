<script>
  import { onMount } from "svelte";
  import { currentProjectMetadata } from "../stores";

  export let dataset;

  let isAbstractExpanded;
  let abstractLinesNumber;

  const toggleExpand = () => {
    isAbstractExpanded = !isAbstractExpanded;
  };

  const findObjectById = (id) => {
    return $currentProjectMetadata?.metadata.find(obj => obj.id === id);
  };

  onMount(() => {
    const el = document.getElementById('abstract');
    const lineHeight = parseInt(window.getComputedStyle(el).getPropertyValue('line-height'));
    const divHeight = el.offsetHeight;
    abstractLinesNumber = divHeight / lineHeight;
    isAbstractExpanded = abstractLinesNumber >= 6 ? false : true;
  });

  console.log(2, dataset)
</script>

<div class=properties>
  {#if dataset}
    {#if dataset?.content.alternativeTitle}
    <div class="property-row">
      <span class=label>Alternative Title</span>
      <span class=data>{dataset?.content.alternativeTitle}</span>
    </div>
    {/if}
  <div class="grid-wrapper">
    <div class="property-row">
      <span class=label>Access</span>
      <span class=data>{dataset?.content.conditionsOfAccess}</span>
    </div>
    <div class="property-row">
      <span class=label>Status</span>
      <span class=data>{dataset?.content.status}</span>
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
      <span class=label>License</span>
      {#if Array.isArray(dataset?.content.license)}
        {#each dataset?.content.license as l}
        <a href={l.url} class=data target=_>CC {(`${l.url.split("/")[4]} ${l.url.split("/")[5]}`).toUpperCase()}</a>
        {/each}
      {/if}
    </div>
    <div class="property-row">
      <span class=label>Type of Data</span>
      <span class=data>{dataset?.content.typeOfData.join(', ')}</span>
    </div>
    {#if dataset?.content.documentation}
    <div class="property-row">
      <span class=label>Additional documentation</span>
      {#if Array.isArray(dataset?.content.documentation)}
        {#each dataset?.content.documentation as d}
          {#if d.url}
          <a class=data href={d.url} target=_>{d.name}</a>
          {:else if d.match("http")}
          <a class=data href={d} target=_>{d}</a>
          {:else}
          <span class=data>{d}</span>
          {/if}
        {/each}
      {/if}
    </div>
    {/if}
  </div>
  <div class="grid-wrapper" style="grid-template-columns: repeat(1, 1fr)">
    <div class="property-row">
      <span class=label>Languages</span>
      <span class=data>{dataset?.content.language.join(', ')}</span>
    </div>
  </div>

  <div class="property-row">
    <span class=label>How To Cite</span>
    <span class=data>{dataset?.content.howToCite}</span>
  </div>

  <div class="property-row">
    <span class=label>Abstract</span>
    {#if Array.isArray(dataset?.content.abstract)}
    <div id=abstract class="data {isAbstractExpanded ? '' : 'abstract-short'}">
      {#each dataset?.content.abstract as a}
        {#if a.url}
        <a class=data href={a.url} target=_>{a.name}</a>
        {:else}
        <span>{a}</span>
        {/if}
      {/each}
    </div>
    {/if}
  </div>

  {#if abstractLinesNumber >= 6}
  <div on:click={toggleExpand} class=expand-button>show {isAbstractExpanded ? "less" : "more"}</div>
  {/if}

  <span class=label>Attributions</span>
  <div class="grid-wrapper">
    {#if Array.isArray(dataset?.content.qualifiedAttribution)}
      {#each dataset?.content.qualifiedAttribution as a}
      <div class="attribution">
        <div style="color: olivedrab">{a.role}</div>
        {#if findObjectById(a.agent[0].id).type === "http://ns.dasch.swiss/repository#Person"}
        <div>{findObjectById(a.agent[0].id)?.givenName.split(";").join(" ")} {findObjectById(a.agent[0].id)?.familyName.split(";").join(" ")}</div>
        {#if findObjectById(a.agent[0].id)?.sameAs}
        <a href={findObjectById(a.agent[0].id)?.sameAs[0].name} target=_>{findObjectById(a.agent[0].id)?.sameAs[0].name}</a>
        {/if}
        {#if findObjectById(a.agent[0].id)?.email}
        <div>{findObjectById(a.agent[0].id)?.email[0]}</div>
        {/if}
        {#if Array.isArray(findObjectById(a.agent[0].id)?.memberOf)}
          {#each findObjectById(a.agent[0].id)?.memberOf as o}
          <div>{findObjectById(o.id).name}</div>
          {/each}
        {/if}
        <div>{findObjectById(a.agent[0].id)?.jobTitle[0]}</div>
        {:else}
        <div>{findObjectById(a.agent[0].id)?.name}</div>
        {/if}
        <br />
      </div>
      {/each}
    {/if}
  </div>

  {/if}
</div>

<style>
  a {
    color: var(--dasch-violet);
  }
  .property-row {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .label, .data {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 2;
    margin-bottom: 10px;
    word-break: break-word;
    width: fit-content;
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
    line-height: 18px;
  }
  .expand-button {
    background-image: linear-gradient(to right, #fff, var(--dasch-grey-3), #fff);
    color: var(--dasch-violet);
    text-align: center;
    font-size: 0.8em;
    padding: 2px 0;
    cursor: pointer;
  }
  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }
  @media screen and (min-width: 576px) {
    .grid-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media screen and (min-width: 768px) {
    .grid-wrapper {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
