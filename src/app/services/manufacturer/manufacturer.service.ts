import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, firstValueFrom, mergeMap } from 'rxjs';
import { ItemCollectionPath, ItemModel } from 'src/app/models/item.model';
import { ManufacturerCollectionPath, ManufacturerModel } from 'src/app/models/manufacturer.model';
import { OrganizationModel } from 'src/app/models/organization.model';
import { OrganizationService } from '../organization/organization.service';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private organizationService: OrganizationService, private store: AngularFirestore) { }

  public getAllManufacturersInOrganization() {
    return this.organizationService.getUserOrganization()
      .pipe(mergeMap(organization => {
        return combineLatest(organization.docs[0].data().manufacturers.map(manufacturer => manufacturer.get()))
    }))
  }

  public getAllManufacturersInOrganizationSync() {
    return this.organizationService.getUserOrganization()
    .pipe(mergeMap(organization => {
      return this.store.doc<OrganizationModel>(organization.docs[0].ref).snapshotChanges()
    }), mergeMap(organization => {
      const manufacturerIds = organization.payload.data()!.manufacturers.map(m => m.id)
      return this.store.collection<ManufacturerModel>(ManufacturerCollectionPath, ref => ref.where('__name__', "in", manufacturerIds)).snapshotChanges()
    }))
  }
  
  public addManufacturer(manufacturer: ManufacturerModel) {
    this.store.collection<ManufacturerModel>(ManufacturerCollectionPath).add(manufacturer).then(manufacturerRef => {
      firstValueFrom(this.organizationService.getUserOrganization()).then(org => {
        this.store.doc(org.docs[0].ref).update({manufacturers: [...org.docs[0].data().manufacturers, manufacturerRef]})
      })
    });
  }

  public editManufacturer(id: string, manufacturer: ManufacturerModel) {
    this.store.doc<ManufacturerModel>(ManufacturerCollectionPath + "/" + id).update(manufacturer)  
  }

  public deleteManufacturer(id: string) {
    this.store.doc<ManufacturerModel>(ManufacturerCollectionPath + "/" + id).delete().then(() => {
      // We delete the manufacturer from the currect users organization 
      firstValueFrom(this.organizationService.getUserOrganization()).then(org => {
        this.store.doc<OrganizationModel>(org.docs[0].ref).update({manufacturers: org.docs[0].data().manufacturers.filter(m => m.id !== id)})
      })

      // We also need to delete it from all items containing it
      // We use a where to cut down on the number of items we get from "backend" to modify
      this.store.collection<ItemModel>(ItemCollectionPath, ref => ref.where('manufacturer', '==', this.store.doc<ManufacturerModel>(ManufacturerCollectionPath + "/" + id).ref)).get().subscribe(items => {
        items.docs.map(d => d.ref.update({manufacturer: null}))
      })
    })
  }
}
