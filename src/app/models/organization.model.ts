import { DocumentReference } from "@angular/fire/compat/firestore";
import { CategoryModel } from "./category.model";
import { ManufacturerModel } from "./manufacturer.model";
import { WarehouseModel } from "./warehouse.model";

export interface OrganizationModel {
    categories: DocumentReference<CategoryModel>[],
    manufacturers: DocumentReference<ManufacturerModel>[],
    users: string[],
    warehouses: DocumentReference<WarehouseModel>[],
    owner: string
}

export const OrganizationCollectionPath = "Organization"