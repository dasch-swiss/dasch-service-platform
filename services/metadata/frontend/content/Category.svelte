<script lang="ts">
  interface Category {
    id: number;
    isOpen: boolean;
    name: string;
    sub: string[];
  };

  let categories = [
    { id: 1, isOpen: false, name: 'Discipline', sub: ['Antropology', 'Geography', 'History'] },
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

  const handleSubCategory = (n: number) => (event: any) => {
    console.log(n);
  }
</script>

<style>
  button {
    min-width: 200px;
    border: 1px solid #000;
    border-radius: 3px;
    background-color: #ddd;
    padding: 5px 20px;
    margin: 5px;
    cursor: pointer;
    text-align: left;
  }
  .visible {
    display: block;
  }
  .in-visible {
    display: none;
  }
  .subcategory {
    display: block;
    cursor: pointer;
    margin: 5px;
    padding: 5px;
    background-color: yellowgreen;
    font-size: 0.8em;
  }
  .not-allowed {
    cursor: not-allowed;
  }
  input[type="radio"] {
    margin-top: -3px;
    vertical-align: middle;
}
</style>

{#each categories as category }
  <button class={category.sub.length > 0 ? '' : 'not-allowed'} on:click={toggleCetegory(category)}>
    {category.name}
  </button>
  {#if category.sub && category.sub.length > 0}
    <div class="{category.isOpen ? 'visible' : 'in-visible'}">
      {#each category.sub as sub, n}
        <label class=subcategory>
          <input on:click={handleSubCategory(n)} value={n} type=radio name=subcategory />{sub}
        </label>
      {/each}
    </div>
  {/if}
{/each}
