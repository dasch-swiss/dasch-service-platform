<script lang='ts'>
  import { currentProjectMetadata } from '../stores';
  import AnotherWidget from './AnotherWidget.svelte';
  import CiteAsWidget from './CiteAsWidget.svelte';
  import ContactWidget from './ContactWidget.svelte';
  import DatasetsWidget from './DatasetsWidget.svelte';
  import DownloadWidget from './DownloadWidget.svelte';
  import KeywordsWidget from './KeywordsWidget.svelte';
  import Tab from './Tab.svelte';

  export let params = {} as any;
  const hiddenProjectProps = ['id', 'type', 'contactPoint', 'dataManagementPlan', 'description', 'keywords', 'name'];

  let project: any;
  let datasets: any[] = [];
  let tabs = [] as any[];

  const getProjectMetadata = async () => {
    const res = await fetch(`http://localhost:3000/projects/${params.id}`)
    const projectMetadata = await res.json();
    currentProjectMetadata.set(projectMetadata);
    project = $currentProjectMetadata.metadata.find((p) => p.type === 'http://ns.dasch.swiss/repository#Project');
    datasets = $currentProjectMetadata.metadata.filter(p => p.type === 'http://ns.dasch.swiss/repository#Dataset');

    datasets.forEach(d => tabs.push({
      label: d.title,
      value: datasets.indexOf(d),
      content: d
    }));
  };

  console.log(2, project, datasets, tabs)

  const handleData = (val: any) => {
    if (Array.isArray(val) && val.length > 1) {
      return val.join(', ')
    } else {
      return val
    }
  }
</script>

<div class="container">
  <div class="row">
    <h1 class="title">
      {project?.name}
    </h1>
  </div>
  <div class="row">
    <div class="column-left">
      <p class=description>{project?.description}</p>
      <!-- <div class="property-row">
        <span class=label>Alternative names</span>
        <span class=data>{project?.alternateName}</span>
      </div>
      <div class="property-row">
        <span class=label>Discipline</span>
        <span class=data>{project?.discipline}</span>
      </div>
      <div class="property-row">
        <span class=label>Alternative names</span>
        <span class=data>{project?.alternateName}</span>
      </div> -->
      {#if project}
        {#each Object.entries(project) as [key, val]}
          {#if !hiddenProjectProps.includes(key)}
          <div class="property-row">
            <span class=label>{key}</span>
            <span class=data>{handleData(val)}</span>
          </div>
          {/if}
        {/each}
      {/if}


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
        <DatasetsWidget />
      </div>
      <div class=widget>
        <CiteAsWidget />
      </div>
      <div class=widget>
        <AnotherWidget />
      </div>
      <div class=widget>
        <KeywordsWidget />
      </div>
      <div class=widget>
        <ContactWidget />
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
  label {display: inline-block;}
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
  .property-row {flex-direction: row;}
  .title {
    display: flex;
    flex-direction: row;
    flex-basis: 100%;
    /* flex: 1; */
    justify-content: center;
    margin-top: 40px;
    padding: 0 20px;
    /* background-color: deepskyblue; */
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
    margin: 10px 0
  }
  .label {
    flex: 1;
    font-weight: bold;
  }
  .description {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    /* font-size: 0.8em; */
    height: 45x;
    margin: 10px 0 25px;
  }
  .widget {
    border: 1px solid #cdcdcd;
    border-radius: 3px;
    background-color: var(--dasch-grey-3);
    margin-bottom: 6px;
    padding: 10px;
  }
  @media screen and (min-width: 992px) {
    .row {
      flex-direction: row;
    }
  }
</style>
