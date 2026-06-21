
(function () {
  var config = window.STAYAREA_ANALYTICS || {};
  var gtmId = config.gtmId;
  var allowedParams = {
    page_type: true,
    page_id: true,
    city: true,
    country: true,
    language: true,
    content_intent: true,
    cta_slot: true,
    source_page: true,
    hotel_id: true,
    hotel_name: true,
    outbound_provider: true,
    affiliate_url_domain: true
  };

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function cleanParams(params) {
    var cleaned = {};
    Object.keys(params || {}).forEach(function (key) {
      if (!allowedParams[key]) return;
      var value = params[key];
      if (value === undefined || value === null || value === "") return;
      cleaned[key] = String(value).slice(0, 120);
    });
    return cleaned;
  }

  function getAffiliateUrlDomain(url) {
    try {
      if (!url || url.charAt(0) === "#") return "";
      return new URL(url, window.location.origin).hostname;
    } catch (error) {
      return "";
    }
  }

  function pushAnalyticsEvent(eventName, params) {
    document.documentElement.dataset.lastAnalyticsEvent = eventName;
    window.dataLayer.push(Object.assign({ event: eventName }, cleanParams(params)));
  }

  function updateConsentMode(consent) {
    gtag("consent", "update", consent || {});
  }

  function initConsentMode() {
    if (!config.consentDefaults) return;
    gtag("consent", "default", config.consentDefaults);
  }

  function loadGtm() {
    if (!gtmId) return;
    document.documentElement.dataset.gtmId = gtmId;
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js"
    });

    var firstScript = document.getElementsByTagName("script")[0];
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtmId);
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  function getPageContext() {
    var pathParts = window.location.pathname.split("/").filter(Boolean);
    var language = document.documentElement.lang || pathParts[0] || "en";
    var city = "";
    var contentIntent = "site_navigation";

    if (pathParts[1] === "hotels" && pathParts[2]) {
      city = pathParts[2];
      contentIntent = pathParts[3] || "hotel_area_guide";
    }

    return {
      page_type: city ? "seo_content" : "site_page",
      page_id: window.location.pathname === "/" ? "home" : pathParts.join("_"),
      city: city,
      country: "",
      language: language,
      content_intent: contentIntent,
      source_page: window.location.pathname
    };
  }

  function handleClick(event) {
    var link = event.target.closest && event.target.closest("a[data-subid]");
    if (!link) return;

    var href = link.getAttribute("href") || "";
    var provider = link.dataset.partner || "";
    var eventName = link.dataset.analyticsEvent || (href.charAt(0) === "#" ? "search_or_compare_submit" : "affiliate_outbound_click");
    var pageContext = getPageContext();

    pushAnalyticsEvent(eventName, Object.assign({}, pageContext, {
      city: link.dataset.city || pageContext.city,
      language: link.dataset.lang || pageContext.language,
      content_intent: link.dataset.contentType || pageContext.content_intent,
      cta_slot: link.dataset.ctaSlot || "",
      page_id: link.dataset.pageKey || pageContext.page_id,
      outbound_provider: provider,
      affiliate_url_domain: getAffiliateUrlDomain(href)
    }));
  }

  initConsentMode();
  loadGtm();
  pushAnalyticsEvent("page_view", getPageContext());

  window.stayAreaAnalytics = {
    getAffiliateUrlDomain: getAffiliateUrlDomain,
    pushAnalyticsEvent: pushAnalyticsEvent,
    updateConsentMode: updateConsentMode
  };

  document.addEventListener("click", handleClick);
})();
