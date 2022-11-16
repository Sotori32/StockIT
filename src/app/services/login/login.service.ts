import { Injectable } from '@angular/core';
import { FirebaseApp, FirebaseError } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, filter, from, lastValueFrom, map, mergeMap, of, zip } from 'rxjs';
import { OrganizationModel } from 'src/app/models/organization.model';
import { UserModel } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth: AngularFireAuth, private store: AngularFirestore) { }

  public login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
  }

  public registerToOrganization(name: string ,email: string, password: string) {
    throw Error("unimplemented")
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
