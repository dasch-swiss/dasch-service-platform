<script lang='ts'>
  import { tick } from 'svelte';
  import { pop } from "svelte-spa-router";
  import { currentProjectMetadata } from '../stores';
  import ProjectWidget from './ProjectWidget.svelte';
  import DownloadWidget from './DownloadWidget.svelte';
  import Tab from './Tab.svelte';

  export let params = {} as any;

  let project: any;
  let datasets: any[] = [];
  let tabs = [] as any[];
  let isExpanded: boolean;
  let isDescriptionExpanded: boolean;
  let descriptionLinesNumber: number;

  const getProjectMetadata = async () => {
    const protocol = window.location.protocol;
    const port = protocol === 'https:' ? '' : ':3000';
    const baseUrl = `${protocol}//${window.location.hostname}${port}/`;
    // const res = await fetch(`${process.env.BASE_URL}projects/${params.id}`);
    const res = await fetch(`${baseUrl}projects/${params.id}`);
    const projectMetadata = await res.json();
    currentProjectMetadata.set(projectMetadata);
    project = $currentProjectMetadata.metadata.find((p: any) => p.type === 'http://ns.dasch.swiss/repository#Project');
    datasets = $currentProjectMetadata.metadata.filter((p: any) => p.type === 'http://ns.dasch.swiss/repository#Dataset');

    datasets.forEach(d => tabs.push({
      label: d.title,
      value: datasets.indexOf(d),
      content: d
    }));

    await tick();
    getDivHeight();

    console.log(1, projectMetadata, project, tabs)
  };

  const handleData = (val: any) => {
    if (Array.isArray(val) && val.length > 1) {
      return val.join(', ')
    } else {
      return val
    }
  };

  const toggleExpand = () => {
    isExpanded = !isExpanded;
  };

  const getDivHeight = () => {
    const el = document.getElementById('description');
    const lineHeight = parseInt(window.getComputedStyle(el).getPropertyValue('line-height'));
    const divHeight = el.offsetHeight;
    descriptionLinesNumber = divHeight / lineHeight;
    isDescriptionExpanded = descriptionLinesNumber >= 6 ? false : true;
  };
</script>

<div class="container">
  <div class="row">
    <h1 class="title top-heading" style="margin-top: 40px">
      {project?.name}
    </h1>
    {#if project?.alternateName}
    <div class="row">
      <h4 class="title new-title">
        Also known as:&nbsp;
        <span style="color:var(--secondary-colour)">{project?.alternateName.join(", ")}</span>
      </h4>
    </div>
    {/if}
  </div>
  <div class="row">
    <div class="column-left">
      <div class="property-row">
        <span class="label new-subtitle">Description</span>
        <div id=description class="data new-text {isExpanded ? '' : 'description-short'}">{project?.description}</div>
      </div>
      <!-- TODO: if accepted and reused consder move it to separate component -->
      {#if descriptionLinesNumber >= 6}
        <div on:click={toggleExpand} class=expand-button>show {isExpanded ? "less" : "more"}</div>
      {/if}

      {#if project?.publication && Array.isArray(project?.publication)}
        <div class="property-row">
          <span class="label new-subtitle">Publications</span>
            {#each project?.publication as p, i}
              {#if i > 1}
                <span class="{isExpanded ? "data new-text" : "hidden"}">{p}</span>
              {:else}
                <span class="data new-text">{p}</span>
              {/if}
            {/each}
        </div>

        {#if project?.publication.length > 2}
          <div on:click={toggleExpand} class=expand-button>show {isExpanded ? "less" : "more"}</div>
        {/if}

      {/if}

      {#await getProjectMetadata() then go}
        <div class="tabs">
          <Tab {tabs} />
        </div>
      {/await}

      <button on:click={() => {window.scrollTo(0,0)}} id=to-top-desktop class=bottom-button title="Get back to the top">
        <svg class=icon fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

    </div>
    <div class="column-right">
      <button on:click={() => {pop()}} class=top-button title="go back to the projects list">
        <svg class=icon fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        <span class=button-label>Go Back</span>
      </button>
      <div class=widget>
        <ProjectWidget {project} />
      </div>
      <div class=widget>
        <DownloadWidget />
      </div>

      <button on:click={() => {window.scrollTo(0,0)}} class="bottom-button m-hidden" title="Get back to the top">
        <svg class=icon fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  </div>
</div>

<style>
  button {
    color: var(--lead-colour);
    box-shadow: var(--shadow-1);
    border: 1px solid #cdcdcd;
    border-radius: 0.25rem;
  }
  button.top-button {
    font-size: 1rem;
    font-family: robotobold;
    text-align: left;
    margin-bottom: 6px;
    padding: 10px 10px 8px;
  }
  .button-label {
    position: relative;
    bottom: 10px;
  }
  button.bottom-button {
    display: inline-block;
    vertical-align: middle;
    background-color: var(--dasch-grey-3);
    padding: 10px;
    width: 3.5rem;
    height: 3.5rem;
  }
  button.bottom-button:hover,
  button.top-button:hover {
    color: #fff;
    background-color: var(--lead-colour);
  }
  #to-top-desktop {
    display: none;
  }
  .container {
    padding: 0 40px;
    display: block;
    max-width: 1200px;
  }
  .title {
    display: flex;
    flex-direction: row;
    flex-basis: 100%;
    margin-bottom: 0;
    padding: 0 20px;
  }
  .column-left, .column-right {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 2;
    padding: 0 20px;
    height: fit-content;
  }
  .column-right {
    flex: 1;
  }
  .description-short {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .widget {
    border: 1px solid #cdcdcd;
    border-radius: 3px;
    background-color: var(--dasch-grey-3);
    margin-bottom: 6px;
    padding: 0 10px 10px;
    box-shadow: var(--shadow-1);
  }
  @media screen and (min-width: 992px) {
    .column-left, .column-right {padding: 20px;}
    .column-left {min-width: 52vw;}
    .column-right {min-width: 30vw;}
    .row {flex-direction: row;}
    #to-top-desktop {display: inline-block;}
  }
  @media screen and (min-width: 1200px) {
    .column-left {min-width: 688px;}
    .column-right {min-width: 352px;}
  }
</style>
