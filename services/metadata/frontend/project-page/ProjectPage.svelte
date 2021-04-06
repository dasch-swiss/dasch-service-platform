<script lang='ts'>
  import { onMount } from 'svelte';
  import type { Project } from '../interfaces';
  import { currentProject } from '../stores';
  import AnotherWidget from './AnotherWidget.svelte';
  import CiteAsWidget from './CiteAsWidget.svelte';
  import ContactWidget from './ContactWidget.svelte';
  import DatasetsWidget from './DatasetsWidget.svelte';
  import DefaultTabComponent from './DefaultTabComponent.svelte';
  import DownloadWidget from './DownloadWidget.svelte';
  import KeywordsWidget from './KeywordsWidget.svelte';
  import Tab from './Tab.svelte';

  export let params = {} as any;
  let project: Project;
  let tabs = [
    { label: "Project",
      value: 1,
      component: DefaultTabComponent
    },
    { label: "Dataset",
      value: 2,
      component: DefaultTabComponent
    },
    { label: "Tab 3",
      value: 3,
      component: DefaultTabComponent
    }
  ];

  onMount(async () => {
    currentProject.subscribe(p => project = p);

    if (!project) {
      await getProject();
    }
  });
  
  let getProject = async () => {
    const res = await fetch(`http://localhost:3000/projects/${params.id}`)
    project = await res.json();

    setTimeout(() => {
      console.log(project);
    }, 1000);
  }

  let promise = getProject();
</script>

<div class="container">
  <div class="row">
    <h1 class="title">
      {project?.name}
    </h1>
  </div>
  <div class="row">
    <div class="column-left">
      <div class=label>Description:</div>
      <p class=description>{project?.description}</p>

      <div class="tabs">
        <Tab {tabs} {project}/>
      </div>
    </div>
    <div class="column-right">
      <div class=widget>
        <a href='/'>Get back to projects list</a>
      </div>
      <div class=widget>
        <DatasetsWidget {project} />
      </div>
      <div class=widget>
        <CiteAsWidget {project} />
      </div>
      <div class=widget>
        <AnotherWidget {project} />
      </div>
      <div class=widget>
        <KeywordsWidget {project}/>
      </div>
      <div class=widget>
        <ContactWidget {project}/>
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
    /* background-color: deepskyblue; */
  }
  .column-left, .column-right {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 2;
    padding: 20px;
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
    background-color: lavenderblush;
    margin: 5px 0;
    padding: 10px;
  }
  @media screen and (min-width: 992px) {
    .row {
      flex-direction: row;
    }
  }
</style>
