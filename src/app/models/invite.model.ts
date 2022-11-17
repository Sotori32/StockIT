import { DocumentReference } from "@angular/fire/compat/firestore";
import { OrganizationModel } from "./organization.model";
import { WarehouseModel } from "./warehouse.model";

export interface InviteModel {
    email: string,
    name: string,
    organization: DocumentReference<OrganizationModel>,
    userCanRead: DocumentReference<WarehouseModel>[],
    userCanWrite: DocumentReference<WarehouseModel>[]
}

export interface InviteDisplayModel {
    email: string,
    name: string,
    id: string,
    link: string
}

export const InviteCollectionPath = "Invite"