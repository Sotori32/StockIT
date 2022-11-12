import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  public register(name: string ,email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password).then(user => {
      this.store.collection<UserModel>('Users').add({
        email,
        name,
        id: user.user?.uid!
      })
      this.store.collection<OrganizationModel>('Organization').add({categories: [], manufacturers: [], users: [user.user?.uid!], warehouses: []})
    });

  }

  public logout() {
    this.auth.signOut()
  }
}
