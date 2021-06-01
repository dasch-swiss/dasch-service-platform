<!-- TODO: try to place it in store -->
<!-- TODO: doesn't work on pagination browse -->
<!-- full guide: https://developer.matomo.org/guides/tracking-javascript-guide -->
<script>

  const url = window.location;
  const productionHostname = 'meta.dasch.swiss';
  const testHostname = 'meta.test.dasch.swiss';
  // TODO: find better solution for loading title and page instead of undefined
  // setTimeout(() => {
    // enable tracking only on production
    if (url.hostname === testHostname) {

      let _paq = window._paq = window._paq || [];

      console.log('TITLE', document.title);

      _paq.push(['setCustomUrl', url.href]);
      _paq.push(['setDocumentTitle', document.title]);
      _paq.push(['trackPageView']);
      
      // Enable Download & Outlink tracking but doesn't track outlinks when opened in new tab
      // to track json, ttl, etc define setDownloadExtensions
      _paq.push(['enableLinkTracking']);
      // adding a class to external links should enable tracking links even if opened in separate tab
      // if not this class can be removed across the app
      _paq.push(['setLinkClasses', 'external-link']);

      // Make Matomo aware of newly added content
      // TODO: check if below works when media or forms are available
      _paq.push(['MediaAnalytics::scanForMedia', document]);
      _paq.push(['FormAnalytics::scanForForms', document]);
      _paq.push(['trackContentImpressionsWithinNode', document]);

      // main matomo function
      (function() {
        let u='https://dasch.matomo.cloud/';
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '2']);
        let d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.src='//cdn.matomo.cloud/dasch.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
      })();
    }
  // }, 1000);
</script>
