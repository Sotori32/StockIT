import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export interface UserModel {
    id: string,
    name: string,
    email: string,
}


export const userConverter: FirestoreDataConverter<UserModel> = {
    toFirestore: function (user: WithFieldValue<UserModel>): DocumentData {
        return {name: user.name, email: user.email}
    },

    fromFirestore: function (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): UserModel {
        const data = snapshot.data(options);
        return {id: snapshot.id, name: data['name'], email: data['email']} 
    }
}