
(function () {
  function handleClick(event) {
    var link = event.target.closest && event.target.closest("a[data-subid]");
    if (!link) return;

    var payload = {
      event: "affiliate_cta_click",
      subid: link.dataset.subid,
      page_key: link.dataset.pageKey,
      lang: link.dataset.lang,
      city: link.dataset.city,
      content_type: link.dataset.contentType,
      cta_slot: link.dataset.ctaSlot,
      partner: link.dataset.partner,
      href_status: link.getAttribute("href") === "#affiliate-placeholder" ? "placeholder" : "approved_url",
      path: window.location.pathname
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === "function") {
      window.gtag("event", "affiliate_cta_click", payload);
    }
  }

  document.addEventListener("click", handleClick);
})();
