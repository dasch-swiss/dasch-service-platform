import {push} from 'svelte-spa-router';
import { writable } from 'svelte/store';
import type { PaginationData } from './interfaces';

export const pagination = writable({} as PaginationData);
export const resultsState = writable(undefined as string);
export const pagedResults = writable([]);
export const currentProjectMetadata = writable(undefined);

let query: string;
export const currentPage = writable(undefined as number);
export const currentResultsRange = writable(undefined as number[]);

export async function getProjectsMetadata(page: number, q?: string): Promise<void> {
  const baseUrl = 'http://localhost:3000/';
  const baseResultsRange = [1, 9];
  let route: string;

  currentResultsRange.set(baseResultsRange.map(v => v + ((page - 1) * baseResultsRange[1])));
  currentPage.set(page);

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
      const totalPages = Math.floor(totalCount/baseResultsRange[1]) + 1;
      // console.log(totalCount, totalPages)
      pagination.set({totalCount, totalPages});
      return r.json();
    })
    .then(data => {pagedResults.set(data), console.log(data)})
}
