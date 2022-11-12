import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export interface ManufacturerModel {
    name: string
}

export const ManufacturerCollectionPath = "Manufacturer"

export const manufacturerConverter: FirestoreDataConverter<ManufacturerModel> = {
    toFirestore: function (category: WithFieldValue<ManufacturerModel>): DocumentData {
        return {name: category.name}
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): ManufacturerModel {
        const data = snapshot.data(options);
        return {name: data['name']} 
    }
}