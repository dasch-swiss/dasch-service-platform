<script>
  import { currentProjectMetadata } from "../stores";

  export let project;
  let grant;

  const findObjectById = (id) => {
    grant = $currentProjectMetadata?.metadata.find(obj => obj.id === id);
    console.log('gr',grant)
    return $currentProjectMetadata?.metadata.find(obj => obj.id === id);
  }
</script>

<h3 class=widget-heading>Project highlights</h3>

<div class=label>Discipline</div>
{#if Array.isArray(project?.discipline)}
{#each project?.discipline as discipline}
{#if typeof discipline === "string"}
<div class="data">{discipline}</div>
{:else}
<a class=data href={discipline.url} target=_>{discipline.name}</a>
{/if}
{/each}
{/if}

<div class=label>Temporal Coverage</div>
{#if Array.isArray(project?.temporalCoverage)}
{#each project?.temporalCoverage as t}
{#if typeof t === "string"}
<div class="data">{t}</div>
{:else}
<a class=data href={t.url} target=_>{t.name}</a>
{/if}
{/each}
{/if}


<div class=label>Spatial Coverage</div>
{#if Array.isArray(project?.spatialCoverage)}
{#each project?.spatialCoverage as s}
<a class=data href={s.place.url} target=_>{s.place.name}</a>
{/each}
{/if}

<div class=label>Start date</div>
<div class=data>{project?.startDate}</div>

{#if project?.endDate}
<div class=label>End date</div>
<div class=data>{project?.endDate}</div>
{/if}


<div class=label>Funder</div>
{#if Array.isArray(project?.funder)}
{#each project?.funder as f}
  {#if findObjectById(f.id).type === "http://ns.dasch.swiss/repository#Person"}
  <div class=data>{findObjectById(f.id)?.givenName.split(";").join(" ")} {findObjectById(f.id)?.familyName}</div>
  {:else if findObjectById(f.id).type === "http://ns.dasch.swiss/repository#Organization"}
  <div class=data>{findObjectById(f.id)?.name}</div>
  {/if}
{/each}
{/if}

{#if project?.grant && Array.isArray(project?.grant)}
<div class=label>Grant</div>
{#each project?.grant as g}
{#if findObjectById(g.id)?.number && findObjectById(g.id)?.url}
<a class=data href={findObjectById(g.id)?.url[0].url} target=_>{findObjectById(g.id)?.number}</a>
{:else}
no details found
{/if}
{/each}
{/if}

{#if project?.contactPoint}
<div class=label>Contact Us</div>
<div class=data>{findObjectById(project?.contactPoint[0].id)?.givenName.split(";").join(" ")} {findObjectById(project?.contactPoint[0].id)?.familyName}</div>
{#if findObjectById(project?.contactPoint[0].id)?.email}
<div class=data>{findObjectById(project?.contactPoint[0].id)?.email[0]}</div>
{/if}
{/if}

<div class=label>Website</div>
<!-- <a class=data href={project?.url[0].url} target=_>{project?.url[0].name}</a> -->
{#if Array.isArray(project?.url)}
{#each project?.url as url}
<a class=data href={url.url} target=_>{url.name}</a>
{/each}
{/if}

{#if project}
<h3 class=widget-heading>Keywords</h3>
{#each project?.keywords as keyword}
<span class="keyword">{keyword}</span>
<span></span>
{/each}
{/if}

<style>
  a {
    color: var(--dasch-violet);
  }
  .keyword {
    display: inline;
    border: 1px solid #cdcdcd;
    border-radius: 0.25rem;
    color: #fff;
    background-color: olivedrab;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    white-space: pre;
    line-height: 2em;
    padding: 5px 6px;
  }
  .label, .data {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 2;
    margin: 5px 0;
    word-break: break-word;
  }
  .label {
    flex: 1;
    font-weight: bold;
    padding: 10px 0 0;
  }
</style>
