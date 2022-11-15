import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, expand, mergeMap, of, Subscription, zip } from 'rxjs';
import { ItemDisplayModel, ItemModel } from 'src/app/models/item.model';
import {MatDialog} from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddItemComponent } from './add-item/add-item.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ItemService } from 'src/app/services/item/item.service';
import { ManufacturerModel } from 'src/app/models/manufacturer.model';
import { DocumentReference } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StorageComponent implements OnInit, OnDestroy {

  private subs = new Subscription();

  columnsToDisplay = [
    'name',
    'sku',
    'categories',
    'warehouse',
    'manufacturer',
    'qty',
    'expiryDate'
  ];

  columnsToDisplayWithExpand = [
    ...this.columnsToDisplay,
    'expand',
  ];

  expandedElement: ItemDisplayModel | null = null;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }


  public items: ItemDisplayModel[] = []

  constructor(private storage: StorageService, private dialog: MatDialog, private itemService: ItemService) {
    this.subs.add(this.storage.getAllItems()
      .subscribe((returned) => {
        this.items = returned.map(([item, warehouse, categories, manufacturer]) => {
          
          return {
            name: item.data.name,
            sku: item.data.sku,
            categories: categories !== undefined ? categories.map(c => {return {name: c?.data()?.name!, ref: c.ref, id: c.id}}) : [],
            warehouse: {name: warehouse.data()?.name!, ref: warehouse.ref, id: warehouse.id},
            manufacturer: manufacturer ? {name: manufacturer.data()?.name, ref: manufacturer.ref, id: manufacturer.id} : null,
            qty: item.data.quantity,
            upc: item.data.upc,
            summary: item.data.summary ?? "",
            purchasePrice: item.data.purchasePrice,
            sellingPrice: item.data.sellingPrice,
            id: item.id,
            expiryDate: item.data.expiryDate
          } as ItemDisplayModel
        })
      }))
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  openAddItemDialog() {
    this.dialog.open(AddItemComponent, {data: null})
  }

  ngOnInit(): void {
  }

  public deleteItem(id: string) {
    this.itemService.deleteItem(id);
  }

  public editItem(item: ItemDisplayModel) {
    this.dialog.open(AddItemComponent, {data: item})
  }

  public getNameFromCategories(categories: {name: string}[]) {
    return categories.map(c => c.name).join(", ")
  }

  public getNameFromManufacturer(manufacturer: {
    name: string;
    ref: DocumentReference<ManufacturerModel>;
    id: string;
} | null): string {
    return manufacturer ? manufacturer.name : ""
  }
}
