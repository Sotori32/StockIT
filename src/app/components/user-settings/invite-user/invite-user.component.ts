import { Component, OnInit } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, first, Subscription } from 'rxjs';
import { WarehouseModel } from 'src/app/models/warehouse.model';
import { UserService } from 'src/app/services/user/user.service';
import { WarehouseService } from 'src/app/services/warehouse/warehouse.service';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit {
  
  public warehouses: { name: string, ref: DocumentReference<WarehouseModel>, selectedCanReadId: string, selectedCanWriteId: string }[] = []
  public warehouseSelectable: Map<string, {ref: DocumentReference<WarehouseModel>, isUserCanRead: boolean}> = new Map();
  private subs: Subscription = new Subscription();

  constructor(private userService: UserService, private warehouseService: WarehouseService) { }

  ngOnInit(): void {
    this.subs.add(this.warehouseService.getAllWarehousesInOrganization().subscribe((warehouses) => {
      this.warehouses =  warehouses.docs.map(w => {
        const canRead = crypto.randomUUID()
        const canWrite = crypto.randomUUID()
        this.warehouseSelectable.set(canWrite, {ref: w.ref, isUserCanRead: false})
        this.warehouseSelectable.set(canRead, {ref: w.ref, isUserCanRead: true})
        return { name: w.data()?.name ?? "", ref: w.ref, selectedCanReadId: canRead, selectedCanWriteId: canWrite }
      })
    }))
    this.subs.add(this.addInviteForm.controls.warehouses.valueChanges.pipe(distinctUntilChanged((prev, curr) => {
      return prev?.length === curr?.length
    })).subscribe(value => {
      let selectedCanWriteWarehouses: [string, {ref: DocumentReference<WarehouseModel>, isUserCanRead: boolean}][] = []
      this.warehouseSelectable.forEach((w, uuid) => {
        if (!w.isUserCanRead && value?.includes(uuid)) {
          selectedCanWriteWarehouses.push([uuid, w])
        } 
      })
      let selectedCanReadWarehouses: [string, {ref: DocumentReference<WarehouseModel>, isUserCanRead: boolean}][] = []
      this.warehouseSelectable.forEach((w, uuid) => {
        if ((w.isUserCanRead && value?.includes(uuid)) || selectedCanWriteWarehouses.find(canWriteWarehouse => w.isUserCanRead && w.ref.id ===  canWriteWarehouse[1].ref.id)) {
          selectedCanReadWarehouses.push([uuid, w])
        }
      })

      this.addInviteForm.controls.warehouses.setValue([...selectedCanReadWarehouses.map(w => w[0]), ...selectedCanWriteWarehouses.map(w => w[0])])
    }))
  }

  public addInviteForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    warehouses: new FormControl<string[]>([], [Validators.required]),
  })

  public getCanWriteFromWarehouseMap(ids: string[]) {
    return ids.map(id => {
      return this.warehouseSelectable.get(id)!
    }).filter(w => {
      return w.isUserCanRead === false
    })
  }

  public getCanReadFromWarehouseMap(ids: string[]) {
    return ids.map(id => {
      return this.warehouseSelectable.get(id)!
    }).filter(w => {
      return w.isUserCanRead === true
    })
  }

  public onSubmit(value: Partial<{name: string | null, email: string | null, warehouses: string[] | null}>) {

    this.userService.createInvite(value.name!, value.email!, this.getCanReadFromWarehouseMap(value.warehouses ?? []).map(w => w.ref), this.getCanWriteFromWarehouseMap(value.warehouses ?? []).map(w => w.ref)).pipe(first()).subscribe()
  }

}
