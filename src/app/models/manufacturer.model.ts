import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export interface ManufacturerModel {
    name: string
}

export const ManufacturerCollectionPath = "Manufacturers"

export interface ManufacturerDisplayModel {
    name: string,
    id: string
}

export const manufacturerConverter: FirestoreDataConverter<ManufacturerModel> = {
    toFirestore: function (manufacturer: WithFieldValue<ManufacturerModel>): DocumentData {
        return {name: manufacturer.name}
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): ManufacturerModel {
        const data = snapshot.data(options);
        return {name: data['name']} 
    }
}