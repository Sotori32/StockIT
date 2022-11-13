import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WarehouseDisplayModel } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse/warehouse.service';
import { AddWarehouseComponent } from './add-warehouses/add-warehouses.component';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css']
})
export class WarehousesComponent implements OnInit, OnDestroy {
  
  constructor(public warehouseService: WarehouseService, private dialog: MatDialog) { }

  private subs: Subscription = new Subscription();
  public warehouses: WarehouseDisplayModel[] = []

  ngOnInit(): void {
    this.subs.add(this.warehouseService.getAllWarehousesInOrganizationSync().subscribe(warehouses => {
      this.warehouses = warehouses.map(w => {
        const warehouse = w.payload.doc.data()
        return {
          address: warehouse.address ?? undefined,
          id: w.payload.doc.id,
          name: warehouse.name,
          place: warehouse.place ?? undefined,
          postcode: warehouse.postcode ?? undefined
        }
      })
    }))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  public addWarehouse() {
    this.dialog.open(AddWarehouseComponent)
  }

  public editWarehouse(warehouse: WarehouseDisplayModel) {
    this.dialog.open(AddWarehouseComponent, {data: warehouse})
  }

  public deleteWarehouse(warehouse: WarehouseDisplayModel) {
    this.warehouseService.deleteWarehouse(warehouse)
  }

  public displayedColumns: string[] = [
    'name', 
    'address',
    'place', 
    'postcode',
    'actions'
  ];
}
