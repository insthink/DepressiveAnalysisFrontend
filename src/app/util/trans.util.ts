export const zip = (left: [], right: []): any[] => {
  if (left.length !== right.length) {
    return [];
  }
  let result: any[] = [];
  for (let i = 0; i < left.length; ++i) {
    result.push([left[i], right[i]]);
  }
  return result;
};
