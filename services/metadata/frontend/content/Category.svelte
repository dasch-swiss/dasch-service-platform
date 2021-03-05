<script lang="ts">
import type { Project } from "./project.model";

  interface Category {
    id: number;
    isOpen: boolean;
    name: string;
    sub: string[];
  };

  export let searched: Project[] = [];

  let categories = [
    { id: 1, isOpen: false, name: 'Discipline', sub: ['Agriculture', 'Antropology', 'Geography', 'History'] },
    { id: 2, isOpen: false, name: 'Type of data', sub: ['First', 'Second'] },
    { id: 3, isOpen: false, name: 'Temporal coverage', sub: [] },
    { id: 4, isOpen: false, name: 'Spatial coverage', sub: [] },
    { id: 5, isOpen: false, name: 'Language', sub: [] },
    { id: 6, isOpen: false, name: 'Keywords', sub: [] },
    { id: 7, isOpen: false, name: 'Person', sub: [] },
    { id: 8, isOpen: false, name: 'Organization', sub: ['Last', 'Not least'] },
  ];

  const toggleCetegory = (cat: any) => (event: any) => {
    let bool = cat.isOpen;
    categories[cat.id - 1].isOpen = !bool;
  };

  const handleSubCategory = (q: string) => (event: any) => {
    fetch(`http://localhost:3000/projects?q=${q}`)
      .then(r => r.json())
      .then(data => {
        console.log(data);
        searched = data;
    });
  }
</script>

{#each categories as category }
  <button class={category.sub.length ? '' : 'not-allowed'} on:click={toggleCetegory(category)}>
    {category.name}
  </button>
  {#if category.sub && category.sub.length}
    <div class={category.isOpen ? 'visible' : 'hidden'}>
      {#each category.sub as sub, n}
        <label class=subcategory>
          <input on:click={handleSubCategory(sub)} value={n} type=checkbox name=subcategory />{sub}
        </label>
      {/each}
    </div>
  {/if}
{/each}

<style>
  button {
    min-width: 200px;
    border: 1px solid #aaa;
    border-radius: 3px;
    padding: 5px 20px;
    margin: 5px;
    cursor: pointer;
    text-align: left;
  }
  .visible {
    display: block;
    max-width: 209px;
  }
  .subcategory {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 5px 5px 5px 5px;
    padding: 5px;
    border-radius: 3px;
    background-color: #f2f2f2;
    font-size: 0.8em;
  }
  .not-allowed {
    cursor: not-allowed;
  }
  input[type=checkbox] {
    margin: 5px 10px;
    display: flex;
  }
  @media screen and (max-width: 991px) {
    button {
      width: 100%;
      margin: 2px 0;
      padding: 10px;
    }
    .visible {
      max-width: 100%;
    }
  }
</style>
