const NS_SEPARATOR: string = ":";

export function getI18NextKeyNamespace(key: string): string {
  if (-1 === key.indexOf(NS_SEPARATOR)) {
    return "";
  }

  return key.split(NS_SEPARATOR)[0];
}
