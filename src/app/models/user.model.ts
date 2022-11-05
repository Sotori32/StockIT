import {OccupationModel} from './occupation.model'

export interface UserModel {
    name: string,
    email: string,
    occupation: OccupationModel
}
