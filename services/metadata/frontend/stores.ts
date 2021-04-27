import {push} from 'svelte-spa-router';
import { writable } from 'svelte/store';
import type { PaginationData } from './interfaces';

export const pagination = writable({} as PaginationData);
export const resultsState = writable(undefined as string);
export const pagedResults = writable([]);
export const currentProjectMetadata = writable(undefined);

let query: string;

export async function getProjectsMetadata(page: number, q?: string): Promise<void> {
  // const baseUrl = process.env.BASE_URL;
  const port = '8080';
  const baseUrl = `${window.location.protocol}//${window.location.hostname}:${port}/`;
  console.log(window.location);
  const baseResultsRange = [1, 9];
  let route: string;
  let currentResultsRange = baseResultsRange.map(v => v + ((page - 1) * baseResultsRange[1]));
  
  if (q || query) {
    if (q) {
      query = q;
    }

    route = `projects?q=${query}&_page=${page}&_limit=${baseResultsRange[1]}`;
  } else {
    route = `projects?_page=${page}&_limit=${baseResultsRange[1]}`;
  }

  // console.log(baseUrl, route);
  resultsState.set(route);
  push(`/${route}`);

  await fetch(`${baseUrl}${route}`)
    .then(r => {
      const totalCount = parseInt(r.headers.get('X-Total-Count'));
      let totalPages = Math.floor(totalCount/baseResultsRange[1]);
      if (!Number.isInteger(totalCount/baseResultsRange[1])) {
        totalPages++;
      };
      // console.log(totalCount, totalPages)
      pagination.set({currentPage: page, currentResultsRange, totalCount, totalPages});
      return r.json();
    })
    .then(data => {pagedResults.set(data), console.log(data)})
}
