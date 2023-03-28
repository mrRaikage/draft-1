export function sortArrayByProperty<T>(array: T[], prop: string): T[] {
  return array.sort((a, b) => {
    if (a[prop] < b[prop]) { return -1; }
    if (a[prop] > b[prop]) { return 1; }
    return 0;
  });
}

export function sortArrayByDate<T>(array: T[], prop: string): T[]{
  return array.slice().sort((a, b) => {
    const dateA = new Date(a[prop]).getTime();
    const dateB = new Date(b[prop]).getTime();
    return dateA - dateB;
  });
}
