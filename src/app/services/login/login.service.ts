import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter, from, map, mergeMap, of, zip } from 'rxjs';
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

  public changePassword(email: string, currPassword: string, password: string) {
    return this.auth.user.pipe(filter(user => !!user), map(u => u!), mergeMap(user => {
      return zip(from(this.auth.signInWithEmailAndPassword(email, currPassword)), of(user))
    }), mergeMap(([credentials, user]) => {
      return user.updatePassword(password)
    }))
  }

  public logout() {
    this.auth.signOut()
  }
}
