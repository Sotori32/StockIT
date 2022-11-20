import { Injectable } from '@angular/core';
import { FirebaseApp, FirebaseError } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { catchError, filter, first, from, lastValueFrom, map, mergeMap, of, zip } from 'rxjs';
import { InviteCollectionPath, InviteModel } from 'src/app/models/invite.model';
import { OrganizationModel } from 'src/app/models/organization.model';
import { UserModel } from 'src/app/models/user.model';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(private auth: AngularFireAuth, private store: AngularFirestore, private warehouseService: WarehouseService) { }
  
  public login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
  }
  
  registerBasicUser(inviteInfo: InviteModel & {ref: DocumentReference<InviteModel>}, password: string) {
    this.auth.createUserWithEmailAndPassword(inviteInfo.email, password).then(user => {
      this.store.collection<UserModel>('Users').add({
        email: inviteInfo.email,
        name: inviteInfo.name,
        id: user.user?.uid!,
        isOwner: false
      })
      this.store.doc<OrganizationModel>(inviteInfo.organization).get().pipe(first()).subscribe(o => {
        this.store.doc<OrganizationModel>(inviteInfo.organization).update({users: [...o.data()?.users!, user.user?.uid!]})
      })
      inviteInfo.userCanRead.map(w => {
        this.warehouseService.addUserToWarehouse(w, user.user?.uid!, true)
      })
      inviteInfo.userCanWrite.map(w => {
        this.warehouseService.addUserToWarehouse(w, user.user?.uid!, false)  
      })
      this.store.doc<InviteModel>(inviteInfo.ref).delete()
    });
  }

  public getInviteInfo(inviteCode: string) {
    return this.store.doc<InviteModel>(InviteCollectionPath + "/" + inviteCode).get()
  }

  public register(name: string ,email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password).then(user => {
      this.store.collection<UserModel>('Users').add({
        email,
        name,
        id: user.user?.uid!,
        isOwner: true
      })
      this.store.collection<OrganizationModel>('Organization').add({categories: [], manufacturers: [], users: [user.user?.uid!], warehouses: [], owner: user.user?.uid!})
    });
  }

  public async changePassword(email: string, currPassword: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
        this.auth.currentUser.then((user) => {
          this.auth.signInWithEmailAndPassword(email, currPassword).then((credentials) => {
            return user?.updatePassword(password).then(() => {
              resolve()
            }, (error) => {
              reject(error)
            })
          }, (error) => {
            reject(error)
          })
        }, (error) => {
          reject(error)
        })
    })
  }

  public logout() {
    this.auth.signOut()
  }
}
