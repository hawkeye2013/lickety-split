const removeLeadingSlash = (path: String): String => {
  return path.length > 0 && path[0] === '/' ? path.slice(1) : path;
};

export { removeLeadingSlash };
