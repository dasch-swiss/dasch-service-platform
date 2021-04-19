import {push} from 'svelte-spa-router';
import { writable } from 'svelte/store';
import type { PaginationData } from './interfaces';

export const pagination = writable({} as PaginationData);
export const resultsState = writable(undefined as string);
export const pagedResults = writable([]);
export const currentProjectMetadata = writable(undefined);

export async function getProjectsMetadata(page: number, q?: string): Promise<void> {
  const baseUrl = 'http://localhost:3000/';
  const pageLimit = 9;
  let url: string;
  let query = '';

  if (q) {
    query = q;
    url = `${baseUrl}projects?q=${query}&`;
  } else {
    if (query) {
      url = `${baseUrl}projects?q=${query}&`;
    } else {
      url = `${baseUrl}`;
    }
  }

  const uri = `projects?_page=${page}&_limit=${pageLimit}`;
  // console.log(url, uri)
  resultsState.set(uri);
  push(`/${uri}`);

  await fetch(url + uri)
    .then(r => {
      const totalCount = parseInt(r.headers.get('X-Total-Count'));
      const totalPages = Math.floor(totalCount/pageLimit) + 1;

      pagination.set({totalCount, totalPages});
      return r.json();
    })
    .then(data => pagedResults.set(data))
}
