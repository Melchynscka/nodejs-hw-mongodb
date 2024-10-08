const parseBoolean = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = typeof type === 'string' ? type : undefined;
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};