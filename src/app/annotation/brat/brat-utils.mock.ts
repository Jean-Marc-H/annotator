import { DocumentData } from '../document-data';
import { Project } from '../../shared/project.model';
import { AnnotatedDocument } from '../../shared/annotated-document.model';
import { CollectionData } from '../collection-data';

export const docData = {
  valid1 : {
    messages: [],
    source_files: ['ann', 'text'],
    modifications: [],
    normalizations: [],
    ctime: 1351154734.5055847,
    text: 'Ed O\'Kelley was the man who shot the man who shot Jesse James.\nJ\'ai castor le plus petit, mais le plus fort.',
    entities: [
      ['N1', 'Person', [[0, 2], [5, 11]]],
      ['N2', 'Person', [[20, 55], [55, 90], [90, 124]]],
      ['N3', 'Person', [[37, 40]]],
      ['N4', 'Object', [[78, 83], [84, 93]]],
      ['N5', 'Person', [[98, 104]]],
      ['N6', 'Person', [[105, 111]]],
      ['N7', 'Person', [[115, 120]]],
      ['N8', 'Person', [[50, 61]]]
    ],
    attributes: [
      ['A1', 'Notorious', 'N4'],
      ['A2', 'Polarity', 'N1', 'Positive'],
      ['A3', 'Polarity', 'N2', 'Negative'],
      ['A4', 'Epic', 'T1'],
      ['A5', 'Safe', 'R1']
    ],
    relations: [
      ['R1', 'Friend', [['From', 'N2'], ['To', 'N1']]]
    ],
    triggers: [
      ['T1', 'Assassination', [[45, 49]]],
      ['T2', 'Resurrection', [[28, 32]]],
      ['T3', 'Bomb', [[78, 93]]]
    ],
    events: [
      ['E1', 'T1', [['Perpetrator', 'N3'], ['Victim', 'N8']]],
      ['E2', 'T2', [['Savior', 'N2'], ['Resurrected', 'N3']]],
      ['E3', 'T3', [['Destroyed', 'N5'], ['Destroyed', 'N6'], ['Destroyed', 'N7']]]
    ],
    comments: [
      ['N1', 'AnnotatorNotes', 'test comment']
    ]
  } as DocumentData,
  docRes1 : {
    text: 'Ed O\'Kelley was the man who shot the man who shot Jesse James.\nJ\'ai castor le plus petit, mais le plus fort.',
    entities: [
      ['N1', 'Person', [[0, 2]]],
      ['N2', 'Person', [[5, 11]]]
    ],
    attributes: [
      ['A1', 'Notorious', 'N1']
    ],
    relations: [
      ['R1', 'Friend', [['From', 'N1'], ['To', 'N2']]]
    ],
    triggers: [],
    events: [],
    comments: [],
    ctime: 1351154734.5055847,
    messages: [],
    modifications: [],
    normalizations: [],
    source_files: []
  }as DocumentData
}

export const annotDoc = {
  doc1: {
    documentId: 'test1',
    title: 'test1',
    file: 'test1',
    text: 'Ed O\'Kelley was the man who shot the man who shot Jesse James.\nJ\'ai castor le plus petit, mais le plus fort.',
    projectId: 'testP1',
    entities: [
      {
        id: 'N1',
        name: 'Person',
        locations: [
          {
            start: 0,
            end: 2
          }
        ],
        type: '',
        labels: [],
        bgColor: '',
        borderColor: '',
        unused: false,
        arcs: [],
        children: []
      },
      {
        id: 'N2',
        name: 'Person',
        locations: [
          {
            start: 5,
            end: 11
          }
        ],
        type: '',
        labels: [],
        bgColor: '',
        borderColor: '',
        unused: false,
        arcs: [],
        children: []
      }
    ],
    attributes: [
      {
        id: 'A1',
        name: 'testA',
        type: 'Notorious',
        labels: [],
        unused: false,
        values: '',
        target: 'N1'
      }
    ],
    relations: [
      {
        id: 'R1',
        type: 'Friend',
        from: {
          id: 'N1',
          role: 'From'
        },
        to: {
          id: 'N2',
          role: 'To'
        },
        labels: [],
        dashArray: '3,3',
        color: '',
        attributes: [],
        args: []
      }
    ],
    events: [
      {
        id: 'E1',
        locations: [
          {
            start: 3,
            end: 7
          }
        ],
        links: [],
        triggerId: 'T1',
        name: 'TestE',
        type: 'Test',
        labels: [],
        bgColor: '',
        borderColor: 'darken',
        attributes: [],
        children: [],
        unused: false,
        arcs: []
      }
    ]
  }as AnnotatedDocument,
  doc2: {
    documentId: 'test2',
    title: 'test2',
    file: 'test2',
    text: 'test1',
    projectId: 'testP2',
    entities: [],
    attributes: [],
    relations: [],
    events: []
  }as AnnotatedDocument
}

export const project = {
  proj1: {
    id: 'test3',
    title: 'test3',
    description: 'test3',
    admin: [],
    annotators: [],
    corpus: [],
    entities: [
      {
        name: 'person',
        type: '',
        labels: [],
        bgColor: '#FE2E2E',
        borderColor: '',
        unused: false,
        arcs: [],
        children: []
      }
    ],
    attributes: [
      {
        name: 'testA',
        type: 'Notorious',
        labels: [],
        unused: false,
        values: {}
      }
    ],
    events: [
      {
        name: 'testE',
        type: '',
        labels: [],
        bgColor: '',
        borderColor: 'darken',
        attributes: [],
        children: [],
        unused: false,
        arcs: []
      }
    ],
    relations: [
      {
        type: 'Friend',
        labels: [],
        dashArray: '3,3',
        color: '',
        attributes: [],
        args: []
      }
    ]
  }as Project
}

export const colData = {
  colRes1 : {
    items: [],
    messages: [],
    search_config: [
      ['Google', 'http://www.google.com/search?q=%s'],
      ['Wikipedia', 'http://en.wikipedia.org/wiki/Special:Search?search=%s'],
      ['UniProt', 'http://www.uniprot.org/uniprot/?sort=score&query=%s'],
      ['EntrezGene', 'http://www.ncbi.nlm.nih.gov/gene?term=%s'],
      ['GeneOntology', 'http://amigo.geneontology.org/cgi-bin/amigo/search.cgi?search_query=%s&action=new-search&search_constraint=term'],
      ['ALC', 'http://eow.alc.co.jp/%s']
    ],
    disambiguator_config: [],
    unconfigured_types: [],
    ui_names: {
      entities: 'entités',
      events: 'événements',
      relations: 'relations',
      attributes: 'attributs'
    },
    entity_types: [
      {
        name: 'person',
        type: '',
        labels: [],
        bgColor: '#FE2E2E',
        borderColor: 'darken',
        unused: false,
        attributes: [],
        children: [],
        arcs: []
      }
    ],
    event_types: [
      {
        name: 'testE',
        type: '',
        labels: [],
        bgColor: '',
        borderColor: 'darken',
        attributes: [],
        children: [],
        unused: false,
        arcs: []
      }
    ],
    relation_types: [
      {
        type: 'Friend',
        labels: [],
        dashArray: '3,3',
        color: '',
        args: []
      }
    ],
    entity_attribute_types: [
      {
        name: 'testA',
        type: 'Notorious',
        labels: [],
        unused: false,
        values: {}
      }
    ],
    event_attribute_types: [],
    relation_attribute_types: []
  }as CollectionData
}
