export interface IChinhDemo {
  id?: number;
  name?: string;
}

export class ChinhDemo implements IChinhDemo {
  constructor(public id?: number, public name?: string) {}
}

export function getChinhDemoIdentifier(chinhDemo: IChinhDemo): number | undefined {
  return chinhDemo.id;
}
