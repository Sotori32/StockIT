import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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

  private subs: Subscription = new Subscription();

  public loading = false;

  public displayedColumns: string[] = [
    'name',
    'address',
    'place',
    'postcode',
    'edit-button',
    'delete-button'
  ];

  public warehouses = new MatTableDataSource<WarehouseDisplayModel>([]);

  constructor(public warehouseService: WarehouseService, private dialog: MatDialog) { }


  ngOnInit(): void {
    this.loading = true;
    this.subs.add(this.warehouseService.getAllWarehousesInOrganizationSync()
      .subscribe(warehouses => {
        this.loading = false;
        this.warehouses = new MatTableDataSource(warehouses.map(w => {
          const warehouse = w.payload.doc.data()
          return {
            address: warehouse.address ?? undefined,
            id: w.payload.doc.id,
            name: warehouse.name,
            place: warehouse.place ?? undefined,
            postcode: warehouse.postcode ?? undefined
          } as WarehouseDisplayModel
        }))
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  public addWarehouse() {
    this.dialog.open(AddWarehouseComponent)
  }

  public editWarehouse(warehouse: WarehouseDisplayModel) {
    this.dialog.open(AddWarehouseComponent, { data: warehouse })
  }

  public deleteWarehouse(warehouse: WarehouseDisplayModel) {
    this.warehouseService.deleteWarehouse(warehouse)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.warehouses.filter = filterValue.trim().toLocaleLowerCase();
  }
}
