export const slugify = (text) => {
  return text
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .trim();
};
