import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, filter, map, mergeMap } from 'rxjs';
import { UserCollectionPath, UserModel } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private store: AngularFirestore, private auth: AngularFireAuth) { }

  public getUserInfoSync() {
    return this.auth.user.pipe(filter(user => !!user), mergeMap((user => {
      
      return this.store.collection<UserModel>(UserCollectionPath, ref => ref.where('id', '==', user!.uid)).snapshotChanges()
    })), map(users => {
      return users[0]
    }))
  }
}
