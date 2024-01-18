export function sumFn(...args: number[]) {
  const result = args.reduce((prev, current) => {
    return prev + current;
  }, 0);
  return result;
}

export function reverse(str: string) {
  return str.split("").reverse().join("");
}


