import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, mergeMap } from 'rxjs';
import { ManufacturerCollectionPath, ManufacturerModel } from 'src/app/models/manufacturer.model';
import { OrganizationService } from '../organization/organization.service';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private organizationService: OrganizationService, private store: AngularFirestore) { }

  public getAllManufacturersInOrganization() {
    return this.organizationService.getUserOrganization()
      .pipe(mergeMap(organization => {
        console.log(organization.docs)
        return combineLatest(organization.docs[0].data().manufacturers.map(manufacturer => manufacturer.get()))
    }))
  }
}
