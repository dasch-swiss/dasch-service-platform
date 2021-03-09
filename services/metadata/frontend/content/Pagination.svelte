<script></script>

<div class="pagination-container">
  <div class="stats">
    <div>
      <p>
        Showing
        <span>1</span>
        to
        <span>9</span>
        of
        <span>100</span>
        results
      </p>
    </div>
  </div>
  <div class="pagination">
    <a href="/">&laquo;</a>
    <a class="active" href="/">1</a>
    <a href="/">2</a>
    <a href="/">3</a>
    <a href="/">4</a>
    <a href="/">5</a>
    <a href="/">6</a>
    <a href="/">&raquo;</a>
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
  a {
    color: black;
    float: left;
    padding: 8px 16px;
    text-decoration: none;
    border: 1px solid #ddd;
  }
  a.active {
    background-color: var(--dasch-violet);
    color: white;
    border: 1px solid var(--dasch-violet);
  }
  a:hover:not(.active) {background-color: #ddd;}
  a:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  a:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
</style>
