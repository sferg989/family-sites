export const GET_ALL_PAGES = `
  query AllPages {
    pages(where: { slug_not: "homepage" }) {
      title
      slug
    }
  }
`;

export const GET_PAGE_BY_SLUG = `
  query Page($slug: String!) {
    page(where: { slug: $slug }) {
      title
      slug
      publishedAt
      updatedAt
      heroImage {
        id
        url
        mimeType
      }
      highlights {
        id
        url
        mimeType
      }
      body {
        html
      }
    }
  }
`;