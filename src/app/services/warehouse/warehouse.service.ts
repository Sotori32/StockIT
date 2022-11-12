import { Injectable } from '@angular/core';
import { combineLatest, mergeMap } from 'rxjs';
import { OrganizationService } from '../organization/organization.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private organizationService: OrganizationService) { }

  public getAllWarehousesInOrganization() {
    return this.organizationService.getUserOrganization()
      .pipe(mergeMap(organization => {
        return combineLatest(organization.docs[0].data().warehouses.map(warehouses => warehouses.get()))
    }))
  }
}
