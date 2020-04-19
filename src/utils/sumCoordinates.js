export default (coordA, coordB) => {
  return Object.keys(coordA).reduce(
    (positionObj, coordinate) => ({
      ...positionObj,
      [coordinate]: coordA[coordinate] + coordB[coordinate],
    }),
    {}
  );
};
