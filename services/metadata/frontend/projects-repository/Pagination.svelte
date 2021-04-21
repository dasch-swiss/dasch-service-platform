<script lang="ts">
  import { getProjectsMetadata, currentPage, pagedResults, pagination, currentResultsRange } from '../stores';

  let handlePagination = (event: MouseEvent) => {
    const id = (event.target as HTMLElement).id;
    if ($currentPage === Number(id)) {
      return;
    } else if (id === 'first') {
      currentPage.set(1);
    } else if (id === 'last') {
      currentPage.set($pagination.totalPages)
    } else {
      currentPage.set(Number(id))
    }
    
    document.querySelector('.active').classList.remove('active');
    document.getElementById(($currentPage).toString()).classList.add('active');
    console.log('curr',$currentPage);
    getProjectsMetadata($currentPage);
  }
</script>

<div class={pagedResults ? 'pagination-container' : 'hidden'}>
  <div class="stats">
    <div>
      <p>
        Showing
        <span>{$currentResultsRange[0]}</span>
        to
        <span>{$currentResultsRange[1] > $pagination.totalCount ? $pagination.totalCount : $currentResultsRange[1]}</span>
        of
        <span>{$pagination.totalCount}</span>
        results
      </p>
    </div>
  </div>
  <div class="pagination">
    <button on:click={handlePagination} id="first" title="First Page" disabled={$currentPage === 1}>&laquo;</button>
    {#each Array($pagination.totalPages) as _, i}
      <button on:click={handlePagination} id={(i + 1).toString()} class={i + 1 === $currentPage ? 'active' : ''}>{i + 1}</button>
    {/each}
    <button on:click={handlePagination} id="last" title="Last Page" disabled={$currentPage === $pagination.totalPages}>&raquo;</button>
  </div>
</div>

<style>
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  .pagination {
    display: inline-block;
    margin: 0 20px;
  }
  button {
    color: black;
    background-color: #fff;
    float: left;
    padding: 8px 16px;
    text-decoration: none;
    border: 1px solid #ddd;
  }
  button.active {
    background-color: var(--dasch-violet);
    color: white;
    border: 1px solid var(--dasch-violet);
  }
  button:hover:not(.active), button:hover:not:disabled {
    background-color: var(--dasch-light-violet);
  }
  button:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  button:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
</style>
