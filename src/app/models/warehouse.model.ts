import { DocumentData, DocumentReference, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { UserModel } from "./user.model";

export interface WarehouseModel {
    name: string,
    address: string,
    place: string,
    postcode: string,
    userCanRead: DocumentReference<UserModel>[],
    userCanWrite: DocumentReference<UserModel>[]
}


export const warehouseConverter: FirestoreDataConverter<WarehouseModel> = {
    toFirestore: function (warehouse: WithFieldValue<WarehouseModel>): DocumentData {
        return {name: warehouse.name, address: warehouse.address, place: warehouse.place, 
            postcode: warehouse.postcode, userCanRead: warehouse.userCanRead, userCanWrite: warehouse.userCanWrite}
    },

    fromFirestore: function (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): WarehouseModel {
        const data = snapshot.data(options);
        return {name: data['name'], address: data['address'], place: data['place'], 
        postcode: data['postcode'], userCanRead: data['userCanRead'], userCanWrite: data['userCanWrite']} 
    }
}