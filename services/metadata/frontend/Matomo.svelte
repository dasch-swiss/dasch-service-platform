<!-- TODO: try to place it in store -->
<!-- TODO: doesn't work on pagination browse -->
<!-- full guide: https://developer.matomo.org/guides/tracking-javascript-guide -->
<script>
  const url = window.location;
  console.log('hostname', url.hostname);
  if (url.hostname !== 'localhost') {
    let _paq = window._paq = window._paq || [];
    _paq.push(['setCustomUrl', url.href]);
    _paq.push(['setDocumentTitle', document.title]);
    _paq.push(['trackPageView']);
    // Enable Download & Outlink tracking but doesn't track outlinks when opened in new tab
    // to track json, ttl, etc use setDownloadExtensions
    _paq.push(['enableLinkTracking']);
    // adding a class to external links should make them trackable even if opened in separate tab
    // if not this class can be removed across the app
    _paq.push(['setLinkClasses', 'external-link']);
    // Make Matomo aware of newly added content
    // TODO: check if below works when media or forms are available
    _paq.push(['MediaAnalytics::scanForMedia', document]);
    _paq.push(['FormAnalytics::scanForForms', document]);
    _paq.push(['trackContentImpressionsWithinNode', document]);
    (function() {
      let u='https://dasch.matomo.cloud/';
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', '2']);
      let d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.src='//cdn.matomo.cloud/dasch.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
    })();
  }
</script>
