const sleep = (time: number): Promise<unknown> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, time);
  });
};

export default sleep;
