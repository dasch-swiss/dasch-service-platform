<script lang='ts'>
  import { currentProjectMetadata } from '../stores';
  import ProjectWidget from './ProjectWidget.svelte';
  import DownloadWidget from './DownloadWidget.svelte';
  import Tab from './Tab.svelte';

  export let params = {} as any;

  let project: any;
  let datasets: any[] = [];
  let tabs = [] as any[];
  let isExpanded: boolean;

  const getProjectMetadata = async () => {
    const res = await fetch(`http://localhost:3000/projects/${params.id}`)
    const projectMetadata = await res.json();
    currentProjectMetadata.set(projectMetadata);
    project = $currentProjectMetadata.metadata.find((p: any) => p.type === 'http://ns.dasch.swiss/repository#Project');
    datasets = $currentProjectMetadata.metadata.filter((p: any) => p.type === 'http://ns.dasch.swiss/repository#Dataset');

    datasets.forEach(d => tabs.push({
      label: d.title,
      value: datasets.indexOf(d),
      content: d
    }));

    console.log(2, projectMetadata, datasets, tabs)
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
</script>

<div class="container">
  <div class="row">
    <h1 class="title" style="margin-top: 40px">
      {project?.name}
    </h1>
    {#if project?.alternateName}
    <div class="row">
      <h4 class="title">
        Also known as:&nbsp;
        <span style="color:olivedrab">{project?.alternateName.join(", ")}</span>
      </h4>
    </div>
    {/if}
  </div>
  <div class="row">
    <div class="column-left">
      <div class="property-row">
        <span class=label>Description</span>
        <span class="description {isExpanded ? '' : 'description-short'}">{project?.description}</span>
      </div>
      <!-- TODO: if accepted and reused consder move it to separate component -->
      <div on:click={toggleExpand} class=expand-button>show {isExpanded ? "less" : "more"}</div>

      <div class={isExpanded ? "" : "hidden"}>
        {#if project?.publication && Array.isArray(project?.publication)}
        <div class="property-row">
          <span class=label>Publications</span>
          {#each project?.publication as p}
          <span class=data>{p}</span>
          {/each}
        </div>
        {/if}
        <div class="property-row">
          <span class=label>DSP Internal Shortcode</span>
          <span class=data>{project?.shortcode}</span>
        </div>
        <div class="property-row">
          <span class=label>Data Management Plan</span>
          <span class=data>{project?.dataManagementPlan ? "available" : "unavailable"}</span>
        </div>
      </div>

      {#await getProjectMetadata() then go}
      <div class="tabs">
        <Tab {tabs} />
      </div>
      {/await}

    </div>
    <div class="column-right">
      <div class=widget>
        <a href='/'>Get back to projects list</a>
      </div>
      <div class=widget>
        <ProjectWidget {project}/>
      </div>
      <div class=widget>
        <DownloadWidget />
      </div>
    </div>
  </div>
</div>

<style>
  a {
    color: var(--dasch-violet);
  }
  .container {
    padding: 0 40px;
    display: block;
    max-width: 1200px;
  }
  .row, .property-row {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
  }
  .title {
    display: flex;
    flex-direction: row;
    flex-basis: 100%;
    margin-bottom: 0;
    padding: 0 20px;
    /* background-color: deepskyblue; */
  }
  h4.title {
    font-size: 0.8em;
  }
  .column-left, .column-right {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 2;
    padding: 20px;
    height: fit-content;
    /* background-color:hotpink; */
  }
  .column-right {
    flex: 1;
    /* background-color: gold; */
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
    flex: 1;
    font-weight: bold;
    margin: 10px 0;
  }
  .description {
    margin-bottom: 10px;
  }
  .description-short {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 45x;
  }
  .widget {
    border: 1px solid #cdcdcd;
    border-radius: 3px;
    background-color: var(--dasch-grey-3);
    margin-bottom: 6px;
    padding: 0 10px 10px;
  }
  .widget:first-child {padding: 10px}
  .expand-button {
    background-image: linear-gradient(to right, #fff, var(--dasch-grey-3), #fff);
    color: var(--dasch-violet);
    text-align: center;
    font-size: 0.8em;
    padding: 2px 0;
    cursor: pointer;
  }
  @media screen and (min-width: 992px) {
    .row {
      flex-direction: row;
    }
  }
</style>
