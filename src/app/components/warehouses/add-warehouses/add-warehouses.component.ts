import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WarehouseDisplayModel, WarehouseModel } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse/warehouse.service';

@Component({
  selector: 'app-add-warehouses',
  templateUrl: './add-warehouses.component.html',
  styleUrls: ['./add-warehouses.component.css']
})
export class AddWarehouseComponent implements OnInit {

  public isEditing: boolean = !!this.data;
  private subs: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WarehouseDisplayModel | undefined,
    private warehouseService: WarehouseService) { }

  ngOnInit(): void {
  }

  addWarehouseForm = new FormGroup({
    name: new FormControl(this.isEditing && this.data && this.data.name ? this.data.name : '', [Validators.required]),
    address: new FormControl(this.isEditing && this.data && this.data.address ? this.data.address : ''),
    place: new FormControl(this.isEditing && this.data && this.data.place ? this.data.place : ''),
    postcode: new FormControl(this.isEditing && this.data && this.data.postcode ? this.data.postcode : ''),
  })

  onSubmit(data: Partial<{name: string | null, address: string | null, place: string | null, postcode: string | null}>) {
    const warehouse = {name: data.name ?? "", address: data.address ?? "", place: data.place ?? "", postcode: data.postcode ?? ""} as WarehouseModel
    if (this.isEditing && this.data) {
      this.warehouseService.editWarehouse(this.data.id, warehouse);
      return
    }
    this.warehouseService.addWarehouse({...warehouse, userCanRead: [], userCanWrite: []})

  }

}
