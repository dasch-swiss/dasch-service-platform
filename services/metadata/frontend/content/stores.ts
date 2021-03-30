import {writable} from "svelte/store";
import type {PaginationData, Project} from "./interfaces";

export const pages = writable({} as PaginationData)
export const pagedResults = writable([]);
export const currentProject = writable(undefined);
const baseUrl = 'http://localhost:3000/projects?';
const pageLimit = 9;
let quary = '';

export async function getProjects(page: number, q?: string): Promise<void> {
  let url: string;

  if (q) {
    quary = q;
    url = `${baseUrl}q=${quary}&`;
  } else {
    if (quary) {
      url = `${baseUrl}q=${quary}&`;
    } else {
      url = baseUrl;
    }
  }

  await fetch(`${url}_page=${page}&_limit=${pageLimit}}`)
    .then(r => {
      let totalCount: number;
      let totalPages: number;
      totalCount = parseInt(r.headers.get('X-Total-Count'));
      totalPages = Math.floor(totalCount/pageLimit) + 1;
      pages.set({totalCount, totalPages});
      return r.json();
    })
    .then(data => pagedResults.set(data))
}
