import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/compat/firestore';
import { combineLatest, filter, from, map, mergeMap } from 'rxjs';
import { InviteCollectionPath, InviteModel } from 'src/app/models/invite.model';
import { OrganizationCollectionPath, OrganizationModel } from 'src/app/models/organization.model';
import { UserCollectionPath, UserModel } from 'src/app/models/user.model';
import { WarehouseCollectionPath, WarehouseModel } from 'src/app/models/warehouse.model';
import { OrganizationService } from '../organization/organization.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor( private store: AngularFirestore, private auth: AngularFireAuth, private organizationService: OrganizationService) { }
  
  public getUserInfoSync() {
    return this.auth.user.pipe(filter(user => !!user), mergeMap((user => {
      
      return this.store.collection<UserModel>(UserCollectionPath, ref => ref.where('id', '==', user!.uid)).snapshotChanges()
    })), map(users => {
      return users[0]
    }))
  }

  public getUsersSync() {
    return this.auth.user.pipe(filter(user => !!user), mergeMap((user => {
      
      return this.store.collection<OrganizationModel>(OrganizationCollectionPath, ref => ref.where('users', 'array-contains', user!.uid)).snapshotChanges()
    }
    )), mergeMap((orgs: DocumentChangeAction<OrganizationModel>[]) => {

      return combineLatest(orgs[0].payload.doc.data().users.map(uid => {
        return this.store.collection<UserModel>(UserCollectionPath, ref => ref.where('id' , '==', uid)).get()
      }))
    }), map(users => {
      return users.map(users => {
        return users.docs[0]
      })
    }))
  }

  public getInvitesSync() {
    return this.organizationService.getUserOrganization().pipe(mergeMap(org => {
      return this.store.collection<InviteModel>(InviteCollectionPath, ref => ref.where('organization', '==', org.ref)).snapshotChanges()
    }))
  }

  public deleteUser(id: string) {
    return this.auth.user.pipe(filter(user => !!user!), mergeMap((user => {
      user!.delete()
      return this.store.collection<UserModel>(UserCollectionPath, ref => ref.where('id', '==', user!.uid)).snapshotChanges()
    })), map(users => {
      return users[0]
    }))
  }

  createInvite(name: string, email: string, userCanRead: DocumentReference<WarehouseModel>[], userCanWrite: DocumentReference<WarehouseModel>[]) {
    return this.organizationService.getUserOrganization().pipe(mergeMap(org => {
      return this.store.collection<InviteModel>(InviteCollectionPath).add({name, email, userCanRead, userCanWrite, organization: org.ref})
    }))
  }

  deleteInvite(documentId: string) {
    ;this.store.collection(InviteCollectionPath + "/" + documentId).doc().delete;
  }
}
