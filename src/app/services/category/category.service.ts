import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FieldPath } from 'firebase/firestore';
import { combineLatest, firstValueFrom, mergeMap } from 'rxjs';
import { CategoryModel, CategoryCollectionPath } from 'src/app/models/category.model';
import { ItemCollectionPath, ItemModel } from 'src/app/models/item.model';
import { OrganizationModel } from 'src/app/models/organization.model';
import { OrganizationService } from '../organization/organization.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  constructor(private store: AngularFirestore, private organizationService: OrganizationService) { }
  
  public getAllOrganizationCategories() {
    return this.organizationService.getUserOrganization()
    .pipe(mergeMap(organization => {
      return combineLatest(organization.docs[0].data().categories.map(category => category.get()))
    }))
  }

  public getAllOrganizationCategoriesSync() {
    return this.organizationService.getUserOrganization()
    .pipe(mergeMap(organization => {
      return this.store.doc<OrganizationModel>(organization.docs[0].ref).snapshotChanges()
    }), mergeMap(organization => {
      return combineLatest(organization.payload.data()!.categories.map(c => {
        const categoryId = c.id
        return this.store.collection<CategoryModel>(CategoryCollectionPath, ref => ref.where('__name__', "==", categoryId)).snapshotChanges()
      }))
    }))
  }
  
  public addCategory(category: CategoryModel) {
    this.store.collection<CategoryModel>(CategoryCollectionPath).add(category).then(categoryRef => {
      firstValueFrom(this.organizationService.getUserOrganization()).then(org => {
        this.store.doc(org.docs[0].ref).update({categories: [...org.docs[0].data().categories, categoryRef]})
      })
    });
  }

  public editCategory(id: string, category: CategoryModel) {
    this.store.doc<CategoryModel>(CategoryCollectionPath + "/" + id).update(category)  
  }

  public deleteCategory(id: string) {
    this.store.doc<CategoryModel>(CategoryCollectionPath + "/" + id).delete().then(() => {
      firstValueFrom(this.organizationService.getUserOrganization()).then(org => {
        this.store.doc(org.docs[0].ref).update({categories: org.docs[0].data().categories.filter(c => c.id !== id)})
      })
      this.store.collection<ItemModel>(ItemCollectionPath, ref => ref.where('category', 'array-contains', this.store.doc<CategoryModel>(CategoryCollectionPath + "/" + id).ref)).get().subscribe(items => {
        items.docs.map(d => d.ref.update({category: d.data().category.filter(c => c.id !== id)}))
      })
    })
  }
}
