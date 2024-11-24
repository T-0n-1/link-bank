export type EJSData = {
  [key: string]: string | number | object;
};

export interface Link {
  id: number;
  linkName: string;
  link: string;
  description: string;
}
