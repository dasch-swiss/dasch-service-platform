<script lang='ts'>
  import { onMount } from 'svelte';
  import type { Project } from '../interfaces';
  import { currentProject } from '../stores';

  export let params = {} as any;
  let project: Project;

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
      <div>Description:</div>
      <p class=description>{project?.description}</p>

      <div class="tabs">
        <button>Project</button>
        <button>Attribution</button>
        <button>Dataset</button>
      </div>

      <div class="properties">
        {#await promise then test}
          {#each project.metadata as data}
            {#each Object.entries(data) as [label, d]}
              <div class=property-row>
                <span class=label>{label}</span>
                <span class=data>{d}</span>
              </div>
            {/each}
          {/each}
        {/await}
      </div>
    </div>
    <div class="column-right">
      <div class=tile>
        <h3>Datasets</h3>
        <input type="radio" name=dataset1>
        <label for=dataset1>dataset 1</label>
        <input type="radio" name=dataset2>
        <label for=dataset2>dataset 1</label>
        <input type="radio" name=dataset3>
        <label for=dataset3>dataset 1</label>
      </div>
      <div class=tile>
        <h3>Cite as</h3>
        <div>blah blah blah</div>
      </div>
      <div class=tile>
        <h3>Something</h3>
        <h5 class=label>Title</h5>
        <div class=data>{project?.name}</div>
        <h5 class=label>Licence</h5>
        <div class=data>no licence</div>
        <h5 class=label>Publication date</h5>
        <div class=data>31/03/2021</div>
        <h5 class=label>Keywords</h5>
        <span class="data keyword">Birds</span>
        <span class="data keyword">Eat</span>
        <span class="data keyword">Dogs</span>
        <span class="data keyword">Hungry</span>
      </div>
      <div class=tile>
        <h3>Contact us</h3>
        <h5 class=label>Website</h5>
        <a href='/'>www.www.www</a>
        <h5 class=label>Address</h5>
        <div class=data>University of This</div>
        <div class=data>This Strasse 123</div>
        <div class=data>0987 That Postfach</div>
        <h5 class=label>Telephone</h5>
        <div class=data>+41 61 123 45 67</div>
        <h5 class=label>Email</h5>
        <div class=data>send@this.uni</div>
      </div>
      <div class=tile>
        <a href='/'>Get back to projects list</a>
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
    background-color: deepskyblue;
  }
  .column-left, .column-right {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 2;
    padding: 20px;
    background-color:hotpink;
  }
  .column-right {
    flex: 1;
    background-color: gold; 
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
  .tile {
    border: 1px solid #cdcdcd;
    border-radius: 3px;
    background-color: lavenderblush;
    margin: 5px 0;
    padding: 10px;
  }
  .keyword {
    display: inline;
    color: #fff;
    background-color: olivedrab;
    border: 1px solid #cdcdcd;
    border-radius: 3px;
    padding: 2px 6px;
  }
  @media screen and (min-width: 992px) {
    .row {
      flex-direction: row;
    }
  }
</style>
