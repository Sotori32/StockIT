import { Component, OnInit } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first, Subscription } from 'rxjs';
import { WarehouseModel } from 'src/app/models/warehouse.model';
import { UserService } from 'src/app/services/user/user.service';
import { WarehouseService } from 'src/app/services/warehouse/warehouse.service';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit {
  
  public warehouses: { name: string, ref: DocumentReference<WarehouseModel> }[] = []
  private subs: Subscription = new Subscription();

  constructor(private userService: UserService, private warehouseService: WarehouseService) { }

  ngOnInit(): void {
    this.subs.add(this.warehouseService.getAllWarehousesInOrganization().subscribe((warehouses) => {
      this.warehouses =  warehouses.docs.map(w => { return { name: w.data()?.name ?? "", ref: w.ref } })
    }))
  }

  public addInviteForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    warehouses: new FormControl([], [Validators.required]),
  })

  public onSubmit(value: Partial<{name: string | null, email: string | null, warehouses: {userCanRead?: DocumentReference<WarehouseModel>, userCanWrite?: DocumentReference<WarehouseModel>}[] | null}>) {
    debugger
    this.userService.createInvite(value.name!, value.email!, value.warehouses?.map(w => w.userCanRead!).filter(w => w !== undefined) ?? [], value.warehouses?.map(w => w.userCanWrite!).filter(w => w !== undefined) ?? []).pipe(first()).subscribe()
  }

}
