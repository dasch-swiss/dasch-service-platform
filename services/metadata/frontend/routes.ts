import ProjectsRepository from './projects-repository/ProjectsRepository.svelte';
import ProjectPage from './project-page/ProjectPage.svelte';

export default {
  '/': ProjectsRepository,
  '/project/:id': ProjectPage
}
