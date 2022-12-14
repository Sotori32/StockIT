import { DocumentReference } from "@angular/fire/compat/firestore";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { UserModel } from "./user.model";

export interface WarehouseModel {
    name: string,
    address: string | null,
    place: string | null,
    postcode: string | null,
    userCanRead: string[],
    userCanWrite: string[]
}

export const WarehouseCollectionPath = "Warehouses"

export interface WarehouseDisplayModel {
    id: string,
    name: string,
    address?: string,
    place?: string,
    postcode?: string
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