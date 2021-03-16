import {writable} from "svelte/store";
import type {PaginationData, Project} from "./interfaces";

export const pages = writable({} as PaginationData)
export const pagedResults = writable([]);
export const currentProject = writable({} as Project);
const pageLimit = 9;

export async function getProjects(page: number): Promise<void> {
  await fetch(`http://localhost:3000/projects?_page=${page}&_limit=${pageLimit}}`)
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
