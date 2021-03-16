import Content from './content/Content.svelte';
import ProjectPage from './content/ProjectPage.svelte';

export default {
  '/': Content,
  '/project/:id': ProjectPage
}
