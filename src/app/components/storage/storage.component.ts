import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, expand, mergeMap, of, Subscription, zip } from 'rxjs';
import { ItemDisplayModel, ItemModel } from 'src/app/models/item.model';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddItemComponent } from './add-item/add-item.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ItemService } from 'src/app/services/item/item.service';
import { ManufacturerModel } from 'src/app/models/manufacturer.model';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


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
export class StorageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tableSort') tableSort = new MatSort();

  private subs = new Subscription();
  
  public loading = false;

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

  columnsToDisplayWithButtons = [
    ...this.columnsToDisplayWithExpand,
    'edit-button',
    'delete-button',
  ]

  expandedElement: ItemDisplayModel | null = null;

  public items = new MatTableDataSource<ItemDisplayModel>([]);
  
  constructor(private storage: StorageService, private dialog: MatDialog, private itemService: ItemService) {
    this.loading = true;
    this.subs.add(this.storage.getAllItems()
      .subscribe((returned) => {
        this.loading = false;
        this.items = new MatTableDataSource(returned.map(([item, warehouse, categories, manufacturer]) => {
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

        }));
        this.items.sort = this.tableSort;
      })
  )}

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.items.filter = filterValue.trim().toLocaleLowerCase();
  }

  ngAfterViewInit() {
    this.items.sort = this.tableSort;
  }

  openAddItemDialog() {
    this.dialog.open(AddItemComponent, {data: null})
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
