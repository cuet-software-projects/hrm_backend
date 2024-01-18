export interface Transformer {
  transform(transformerDataInput: Object): Object;
}

export interface CollectionTransformer {
  transformCollection(transformerDataInput: Object[]): Object[];
}
