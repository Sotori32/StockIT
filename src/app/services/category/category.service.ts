import { Injectable } from '@angular/core';
import { combineLatest, mergeMap } from 'rxjs';
import { OrganizationService } from '../organization/organization.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private organizationService: OrganizationService) { }

  public getAllOrganizationCategories() {
    return this.organizationService.getUserOrganization()
      .pipe(mergeMap(organization => {
        console.log(organization.docs)
        return combineLatest(organization.docs[0].data().categories.map(category => category.get()))
      }))
  }
}
