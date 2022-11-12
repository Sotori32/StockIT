import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from } from 'rxjs';
import { OrganizationCollectionPath, OrganizationModel } from 'src/app/models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private auth: Auth, private store: AngularFirestore) { }

  public getUserOrganization() {
    return from(this.store.collection<OrganizationModel>(OrganizationCollectionPath).ref.where('users', 'array-contains', this.auth.currentUser!.uid).get())
  }
}
