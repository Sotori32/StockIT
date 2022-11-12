import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, mergeMap, of, zip } from 'rxjs';
import { ItemModel } from 'src/app/models/item.model';
import {MatDialog} from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddItemComponent } from './add-item/add-item.component';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {

  displayedColumns = [
    'name',
    'sku',
    'categories',
    'warehouse',
    'manufacturer',
    'qty'
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }


  public items: ItemDisplayModel[] = []

  constructor(private storage: StorageService, private dialog: MatDialog) {
    this.storage.getAllItems()
      .subscribe((returned) => {
        this.items = returned.map(([item, warehouse, categories, manufacturer]) => {
          
          return {
            name: item.name,
            sku: item.sku,
            categories: categories !== undefined ? categories.filter(c => !!c!).map(c => c?.name).join(", ") : "",
            warehouse: warehouse !== undefined ? warehouse.name : '',
            manufacturer: manufacturer ? manufacturer.name : '',
            qty: item.quantity
          }
        })
      })
  }

  openAddItemDialog() {
    this.dialog.open(AddItemComponent)
  }

  ngOnInit(): void {
  }

}

interface ItemDisplayModel {
  name: string,
  sku: string,
  categories: string,
  warehouse: string
  manufacturer: string,
  qty: number
}
