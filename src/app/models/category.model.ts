import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore"

export interface CategoryModel {
    name: string
}

export const CategoryCollectionPath = "Categories"

export const categoryConverter: FirestoreDataConverter<CategoryModel> = {
    toFirestore: function (category: WithFieldValue<CategoryModel>): DocumentData {
        return {name: category.name}
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): CategoryModel {
        const data = snapshot.data(options);
        return {name: data['name']} 
    }
}

export interface CategoryDisplayModel {
    name: string,
    id: string
}