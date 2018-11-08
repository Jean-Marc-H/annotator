// Rôle : Ce module a pour rôle de faire la liaison entre la vue du composant et les données envoyées par le service.
// Dans le cas de ce module, il s'agit de permettre de visualiser les données du projet et de sauvegarder les
// différents changements que l’utilisateur peut faire.

import 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddAdminComponent } from '../add-admin/add-admin.component';
import { AddAnnotatorComponent } from '../add-annotator/add-annotator.component';
import { AddAttributeComponent } from '../add-attribute/add-attribute.component';
import { AddEntityComponent } from '../add-entity/add-entity.component';
import { AddCorpusComponent } from '../add-corpus/add-corpus.component';
import { AddEventComponent } from '../add-event/add-event.component';
import { AddRelationComponent } from '../add-relation/add-relation.component';
import { Attribute } from '../../shared/attribute.model';
import { AuthService } from '../../shared/security/auth.service';
import { Event } from '../../shared/event.model';
import { Observable } from 'rxjs/Observable';
import { Project } from '../../shared/project.model';
import { ProjectService } from './project.service';
import { Relation } from '../../shared/relation.model';
import { User } from './../../shared/user.model';
import { YesNoDialogBoxComponent } from '../yes-no-dialog-box/yes-no-dialog-box.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  currentProject: Project = {
    id: '',
    title: '',
    description: '',
    admin: [],
    annotators: [],
    corpus: [],
    entities: [],
    attributes: [],
    events: [],
    relations: [],
  };
  private sub: any;
  isDataLoaded = false;

  users: Observable<User[]>;
  corpus: Observable<any[]>;
  annotators: any[] = []; // {uid: v1, email: v2}[]
  admin: any[] = []; // {uid: v1, email: v2}[]
  isConnected = false;

  constructor(
    private authService: AuthService,
    private activeRouter: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private ps: ProjectService
  ) { }

  ngOnInit() {
    this.isConnected = this.authService.isConnected();
    this.sub = this.activeRouter.params.subscribe(params => {
      this.ps.getProject(params.id).then(doc => {
        this.currentProject = doc.data();
        this.corpus = this.ps.getCorpus(this.currentProject.id);

        if (this.isConnected) {
          this.users = this.ps.getUsers();
          this.getAnnotatorEmail();
          this.getAdminEmail();
        }
      });
    });
    this.isDataLoaded = true;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAnnotatorEmail() {
    this.annotators = [];
    this.currentProject.annotators.forEach((uid, i) => {
      this.users.forEach(x => {
        x.forEach((u, j) => {
          if (u.uid === uid) {
            this.annotators.push({ email: u.email, uid: u.uid });
          }
        });
      });
    });
  }

  getAdminEmail() {
    this.admin = [];
    this.currentProject.admin.forEach((uid, i) => {
      this.users.forEach(x => {
        x.forEach((u, j) => {
          if (u.uid === uid) {
            this.admin.push({ email: u.email, uid: u.uid });
          }
        });
      });
    });
  }

  // Sauvegarde les modifications apportées au projet.
  saveProjectModification() {
    if (
      this.currentProject.title != null &&
      this.currentProject.title !== '' &&
      this.currentProject.description != null &&
      this.currentProject.description !== ''
    ) {
      this.ps.saveProject(this.currentProject);

      alert('Modification sauvegardé');
    }
  }

  // ouvre la boîte de dialogue pour ajouter un corpus
  addCorpusDialogBox() {
    const dialogRef = this.dialog.open(AddCorpusComponent, {
      width: '250px',
      data: { corpusTitle: undefined, corpusFile: undefined },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (
          result.corpusTitle !== undefined &&
          result.corpusFile !== undefined
        ) {
          // est-ce qu'il y a une validation ici a faire? (titre du fichier déjà existant?)
          this.ps.addCorpus(result, this.currentProject.id);
        }
      }
    });
  }

  // ouvre la boîte de dialogue pour ajouter une catégorie
  addEntityDialogBox() {
    const dialogRef = this.dialog.open(AddEntityComponent, {
      width: '250px',
      data: {
        entityName: undefined,
        type: undefined,
        etiquettes: undefined,
        entityColor: undefined,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addEntitiesAfterClosedHandler(result);
    });
  }

  addEntitiesAfterClosedHandler(result: any) {
    let entityExists = false;
    if (result !== undefined) {
      if (
        result.entityName !== undefined &&
        result.entityColor !== undefined &&
        result.type !== undefined &&
        result.etiquettes !== undefined
      ) {
        this.currentProject.entities.forEach(item => {
          if (item.name === result.entityName) {
            entityExists = true;
            if (item.bgColor === result.entityColor) {
              alert('The entity already exists');
            } else {
              alert('Replacing color');
              item.bgColor = result.entityColor;
            }
          } else if (item.bgColor === result.entityColor) {
            entityExists = true;
            alert('The chosen color is already used');
          }
        });

        if (!entityExists) {
          let etiquettesArray: string[];
          etiquettesArray = result.etiquettes.split(',');
          this.currentProject.entities.push({
            name: result.entityName,
            type: result.type,
            bgColor: result.entityColor,
            labels: etiquettesArray,
          });
        }
      }
    }
  }

  // Supprime la catégorie spécifiée dans l'écran du projet (pas de sauvegarde dans firestore).
  deleteEntity(entityName: string) {
    const dialogRef = this.dialog.open(YesNoDialogBoxComponent, {
      width: '250px',
      data: {
        text: 'entity',
        response: undefined
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response === true) {
        this.currentProject.entities.forEach((item, index) => {
          if (item.name === entityName) {
            this.currentProject.entities.splice(index, 1);
          }
        });
      }
    });
  }

  // ouvre la boîte de dialogue pour ajouter un annotateur
  addAnnotatorDialogBox() {
    const dialogRef = this.dialog.open(AddAnnotatorComponent, {
      width: '600px',
      height: '600px',
      data: { UserId: undefined },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addAnnotatorAfterClosedHandler(result);
    });
  }

  addAnnotatorAfterClosedHandler(result: any) {
    let annotatorExists = false;
    if (result !== undefined) {
      this.currentProject.annotators.forEach(item => {
        if (item === result.uid) {
          annotatorExists = true;
        }
      });
      if (!annotatorExists) {
        this.currentProject.annotators.push(result.uid);
        this.annotators.push({ uid: result.uid, email: result.email });
      } else {
        alert('This annotator already exists');
      }
    }
  }

  // Supprime l'annotateur spécifié dans l'écran du projet (pas de sauvegarde dans firestore).
  deleteAnnotator(uid: string) {
    const dialogRef = this.dialog.open(YesNoDialogBoxComponent, {
      width: '250px',
      data: {
        text: 'Annotator',
        response: undefined
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response === true) {
        this.currentProject.annotators.forEach((item, index) => {
          if (item === uid) {
            this.currentProject.annotators.splice(index, 1);
          }
        });
        this.annotators.forEach((item, index) => {
          if (item.uid === uid) {
            this.annotators.splice(index, 1);
          }
        });
      }
    });
  }

  // ouvre la boîte de dialogue pour ajouter un administrateur
  addAdminDialogBox() {
    const dialogRef = this.dialog.open(AddAdminComponent, {
      width: '600px',
      height: '600px',
      data: { UserId: undefined },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addAdminAfterClosedHandler(result);
    });
  }

  addAdminAfterClosedHandler(result: any) {
    let adminExists = false;
    if (result !== undefined) {
      this.currentProject.admin.forEach(item => {
        if (item === result.uid) {
          adminExists = true;
        }
      });
      if (!adminExists) {
        this.currentProject.admin.push(result.uid);
        this.admin.push({ uid: result.uid, email: result.email });
      } else {
        alert('This admin already exists');
      }
    }
  }

  // Supprime l'admin spécifié dans l'écran du projet (pas de sauvegarde dans firestore).
  deleteAdmin(uid: string) {
    const dialogRef = this.dialog.open(YesNoDialogBoxComponent, {
      width: '250px',
      data: {
        text: 'Administrator',
        response: undefined
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response === true) {
        this.currentProject.admin.forEach((item, index) => {
          if (item === uid) {
            this.currentProject.admin.splice(index, 1);
          }
        });
        this.admin.forEach((item, index) => {
          if (item.uid === uid) {
            this.admin.splice(index, 1);
          }
        });
      }
    });
  }

  // ouvre la boîte de dialogue pour ajouter un attribut
  addAttributesDialogBox() {
    const dialogRef = this.dialog.open(AddAttributeComponent, {
      width: '400px',
      data: { UserId: undefined },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addAttributesAfterClosedHandler(result);
    });
  }

  addAttributesAfterClosedHandler(result: any) {
    let attributeExists = false;
    if (result !== undefined && result !== '') {
      this.currentProject.attributes.forEach(item => {
        if (item.name === result.attributeName) {
          attributeExists = true;
        }
      });
      if (!attributeExists) {
        const array = result.valeurs.split(',');
        this.currentProject.attributes.push({
          name: result.attributeName,
          type: result.type,
          valeurs: array,
        });
      } else {
        alert('This attribute already exists');
      }
    }
  }

  // Supprime l'attribut spécifié dans l'écran du projet (pas de sauvegarde dans firestore).
  deleteAttribute(target: Attribute) {
    const dialogRef = this.dialog.open(YesNoDialogBoxComponent, {
      width: '250px',
      data: {
        text: 'Attribute',
        response: undefined
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response === true) {
        this.currentProject.attributes.forEach((item, index) => {
          if (item.name === target.name) {
            this.currentProject.attributes.splice(index, 1);
          }
        });
      }
    });
  }
  /**
   * Boite de dialogue pour création de relation
   */
  addRelationDialogBox() {
    const dialogRef = this.dialog.open(AddRelationComponent, {
      width: '400px',
      data: {
        name: undefined,
        color: undefined,
        entity: undefined,
        type: undefined,
      },
    });

    dialogRef.afterClosed().subscribe((result: Relation) => {
      this.addRelation(result);
    });
  }
  /**
   *  Ajouter la donnée dans la liste de relation
   * @param data la donnée à ajouter
   */
  public addRelation(data: Relation) {
    if (data) {
      if (this.isExist(data)) {
        alert('This relation already exists');
      } else {
        this.currentProject.relations.push(data);
      }
    }
  }
  /**
   * Verifier si la relation existe dans la liste de relation
   * @param data la donnée à verifier
   * @returns true quand la donnée existe dans la liste
   *          false quand la donnée n'existe pas dans la liste
   */
  public isExist(data: Relation): boolean {
    let exist = false;
    this.currentProject.relations.forEach(relation => {
      if (relation.name === data.name) {
        exist = true;
      }
    });
    return exist;
  }
  /**
   * Supprime l'attribut spécifié dans l'écran du projet (pas de sauvegarde dans firestore).
   *  @param target
   * */
  deleteRelation(target: Relation) {
    const dialogRef = this.dialog.open(YesNoDialogBoxComponent, {
      width: '250px',
      data: {
        text: 'Relation',
        response: undefined
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response === true) {
        this.currentProject.relations.forEach((relation, index) => {
          if (relation.name === target.name) {
            this.currentProject.relations.splice(index, 1);
          }
        });
      }
    });
  }

  addEventDialogBox() {
    const dialogRef = this.dialog.open(AddEventComponent, {
      width: '400px',
      data: {
        eventName: undefined,
        type: undefined,
        etiquettes: undefined,
        attributs: undefined,
        eventColor: undefined,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addEventAfterClosedHandler(result);
    });
  }

  addEventAfterClosedHandler(result: any) {
    let eventExists = false;
    if (result !== undefined && result !== '') {
      this.currentProject.events.forEach(item => {
        if (item.name === result.eventName) {
          eventExists = true;
        }
      });
      if (!eventExists) {
        this.currentProject.events.push(this.mapValidResultToEvent(result));
      } else {
        alert('This event already exists');
      }
    }
  }

  mapValidResultToEvent(result: any): Event {
    return {
      name: result.eventName,
      type: result.type,
      etiquettes: result.etiquettes.split(','),
      attributs: result.attributs.split(','),
      color: result.eventColor,
    };
  }

  // Supprime l'attribut spécifié dans l'écran du projet (pas de sauvegarde dans firestore).
  deleteEvent(target: Event) {
    const dialogRef = this.dialog.open(YesNoDialogBoxComponent, {
      width: '250px',
      data: {
        text: 'Event',
        response: undefined
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response === true) {
        this.currentProject.events.forEach((event, index) => {
          if (event.name === target.name) {
            this.currentProject.events.splice(index, 1);
          }
        });
      }
    });
  }

  // Événement lorsqu'un texte est sélectionné
  documentSelected(doc: any) {
    doc.projectTitle = this.currentProject.title;
    this.router.navigate(['/annotation', doc]);
  }

  // Supprime un texte
  deleteCorpus(corpus: any) {
    const dialogRef = this.dialog.open(YesNoDialogBoxComponent, {
      width: '250px',
      data: {
        text: 'Corpus',
        response: undefined
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response === true) {
        this.ps.deleteCorpus(corpus.id, corpus.title);
      }
    });
  }
}
