import Manager from './manager';
import { Document } from './tab';

it('converts an entity to a doc', () => {
  const manager = new Manager();
  const entity: any = {
    id: 'ID',
    tabId: 'tab1',
    prop: 'value',
  };
  const entityCopy = {...entity};

  const doc = manager.entityToDoc(entity);

  expect(doc).toEqual({_id: 'ID', prop: 'value'});

  // entity should not have been changed
  expect(entity).toEqual(entityCopy);
});

it('converts a doc to an entity', () => {
  const manager = new Manager();
  const doc: Document = {
    _id: 'ID',
    _rev: 'rev',
    type: 'T',
    prop: 'value',
  };
  const docCopy = {...doc};

  const entity: any = manager.docToEntity('tab1', doc);

  expect(entity).toEqual({id: 'ID', type: 'T', tabId: 'tab1', prop: 'value'});

  // doc should not have been changed
  expect(doc).toEqual(docCopy);
});

it('converts a list of docs to entities', () => {
  const manager = new Manager();
  const docs: any = [
    {
      _id: 'ID',
      _rev: 'rev',
      type: 'T',
    },
    {
      _id: 'ID2',
      _rev: 'rev',
      type: 'T',
    }
  ];

  expect(manager.docsToEntities('tab1', docs)).toEqual([
    {
      id: 'ID',
      tabId: 'tab1',
      type: 'T',
    },
    {
      id: 'ID2',
      tabId: 'tab1',
      type: 'T',
    }
  ])
});
