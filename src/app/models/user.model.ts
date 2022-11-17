import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export interface UserModel {
    id: string,
    name: string,
    email: string,
    isOwner: boolean
}

export const UserCollectionPath = "Users"

export interface UserDisplayModel {
    id: string,
    documentId: string,
    name: string,
    email: string,
    isOwnder: boolean,
}

export const userConverter: FirestoreDataConverter<UserModel> = {
    toFirestore: function (user: WithFieldValue<UserModel>): DocumentData {
        return {name: user.name, email: user.email, isOwner: user.isOwner}
    },

    fromFirestore: function (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): UserModel {
        const data = snapshot.data(options);
        return {id: snapshot.id, name: data['name'], email: data['email'], isOwner: data['isOwner']} 
    }
}