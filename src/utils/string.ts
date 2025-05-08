export const capitalize = <T extends string>(s: T) =>
  (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

export const renewal = <T extends string>(s: T) => {
  const words = s.split("-");
  const result = `${capitalize(words[0])} ${words[1].toUpperCase()}`;

  return result;
};
