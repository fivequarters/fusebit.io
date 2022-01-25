function urlOrSvgToImage (img = '') {
  return img.match('^<svg') ? `data:image/svg+xml;utf8,${encodeURIComponent(img)}` : img;
}