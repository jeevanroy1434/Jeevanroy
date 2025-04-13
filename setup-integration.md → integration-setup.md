# Vivia Try-Us Inc

[![Netlify Status](https://api.netlify.com/api/v1/badges/06c05390-35db-47e5-812a-b79612ea8043/deploy-status)](https://app.netlify.com/sites/vivia-tryus-inc/deploys)

Vivia Rentals is a modern property rental platform enabling seamless payment integrations, listing feeds, and crypto payment processing with Simplex.

## Project Highlights

- Hosted on **Netlify**
- Backend powered by **Node.js**
- GitHub Actions for **SLSA 3-compliant** publishing
- Integrated with **Simplex API** sandbox
- Facebook Marketplace feed via dynamic **XML + Cloud Run**

---

## Integration Docs

- [Setup Integration with Simplex](./company/integrations/vivia/setup-integration.md)
- [Hotpads XML Feed](./company/integrations/vivia/vivia_hotpads_feed.xml)

---

## CI/CD - GitHub Actions

This repo includes the `generator-generic-ossf-slsa3-publish.yml` workflow:

- Runs on `main` push/PR
- Caches and builds using Node.js
- Verifies and uploads artifacts with SLSA provenance

```yaml
.github/workflows/generator-generic-ossf-slsa3-publish.yml
