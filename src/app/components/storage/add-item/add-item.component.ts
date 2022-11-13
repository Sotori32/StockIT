import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { CategoryModel } from 'src/app/models/category.model';
import { ManufacturerModel } from 'src/app/models/manufacturer.model';
import { WarehouseModel } from 'src/app/models/warehouse.model';
import { CategoryService } from 'src/app/services/category/category.service';
import { ItemService } from 'src/app/services/item/item.service';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import { WarehouseService } from 'src/app/services/warehouse/warehouse.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemDisplayModel, ItemModel } from 'src/app/models/item.model';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit, OnDestroy {

  public selectedCategories: string[] = [];
  public categories: [string, { name: string, ref: DocumentReference<CategoryModel> }][] = []
  public selectableCategories = new Map<string, { name: string, ref: DocumentReference<CategoryModel> }>();

  public manufacturers: [string, { name: string, ref: DocumentReference<ManufacturerModel> }][] = []
  public selectableManufacturers = new Map<string, { name: string, ref: DocumentReference<ManufacturerModel> }>();

  public warehouses: [string, { name: string, ref: DocumentReference<WarehouseModel> }][] = []
  public selectableWarehouses = new Map<string, { name: string, ref: DocumentReference<WarehouseModel> }>()

  public isEditing = this.data !== null

  private sub = new Subscription()

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ItemDisplayModel | null,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    private warehouseService: WarehouseService) {
    debugger;
    this.selectedCategories = this.isEditing && this.data ? this.data.categories.map(c => c.id) : []
  }

  ngOnInit(): void {
    this.sub.add(this.categoryService.getAllOrganizationCategories().subscribe((categories) => {
      categories.forEach(c => { this.selectableCategories.set(c.id, { name: c.data()?.name ?? "", ref: c.ref }) });
      this.categories = this.getAllCategories()
    }))
    this.sub.add(this.addItemForm.controls['category'].valueChanges.subscribe(v => { this.selectedCategories = v ? v : [] }))
    
    this.sub.add(this.manufacturerService.getAllManufacturersInOrganization().subscribe((m) => {
      m.forEach(m => { this.selectableManufacturers.set(m.id, { name: m.data()?.name ?? "", ref: m.ref }) })
      this.manufacturers = this.getAllManufacturers()
    }))
    
    this.sub.add(this.warehouseService.getAllWarehousesInOrganization().subscribe((warehouses) => {
      warehouses.forEach(w => { this.selectableWarehouses.set(w.id, { name: w.data()?.name ?? "", ref: w.ref }) })
      this.warehouses = this.getAllWarehouses()
    }))
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }


  addItemForm = new FormGroup({
    itemName: new FormControl(this.isEditing ? this.data?.name! : '', [Validators.required]),
    sku: new FormControl(this.isEditing ? this.data?.sku! : '', [Validators.required]),
    upc: new FormControl(this.isEditing ? this.data?.upc! : '', [Validators.required]),
    summary: new FormControl(this.isEditing ? this.data?.summary : ''),
    category: new FormControl<string[] | null>(this.isEditing && this.data ? this.data.categories!.map(c => c.id!) : null),
    manufacturer: new FormControl<string | null>(this.isEditing && this.data && this.data.manufacturer ? this.data.manufacturer.id : null),
    warehouse: new FormControl<string | null>(this.isEditing && this.data ? this.data.warehouse!.id : null, [Validators.required]),
    purchasePrice: new FormControl(this.isEditing ? this.data?.purchasePrice! : null, [Validators.required]),
    sellingPrice: new FormControl(this.isEditing ? this.data?.sellingPrice! : null, [Validators.required]),
    quantity: new FormControl(this.isEditing ? this.data?.qty! : null, [Validators.required]),
  })

  public getCategoryById(id: string) {
    return this.selectableCategories.get(id)!
  }

  public getAllCategories() {
    let categories: [string, {
      name: string;
      ref: DocumentReference<CategoryModel>;
    }][] = [];
    this.selectableCategories.forEach((c, key) => {
      categories.push([key, c])
    })
    if (categories.length != 0) {
      debugger;
    }
    return categories
  }

  public getAllManufacturers() {
    let manufacturers: [string, {
      name: string;
      ref: DocumentReference<ManufacturerModel>;
    }][] = [];
    this.selectableManufacturers.forEach((c, key) => {
      manufacturers.push([key, c])
    })
    return manufacturers
  }

  public getAllWarehouses() {
    let warehouses: [string, {
      name: string;
      ref: DocumentReference<WarehouseModel>;
    }][] = [];
    this.selectableWarehouses.forEach((c, key) => {
      warehouses.push([key, c])
    })
    return warehouses
  }

  public getManufacturerById(id: string) {
    return this.selectableManufacturers.get(id)!
  }

  public getWarehouseById(id: string) {
    return this.selectableWarehouses.get(id)!
  }


  onSubmit(value: Partial<{ itemName: string | null; sku: string | null; upc: string | null; summary: string | null; category: string[] | null; manufacturer: string | null; warehouse: string | null; sellingPrice: number | null; purchasePrice: number | null; quantity: number | null; }>) {

    const item = { name: value.itemName ?? "", sku: value.sku ?? "", upc: value.upc ?? "", summary: value.summary ?? "", category: value.category?.map(cid => this.getCategoryById(cid).ref) ?? [], manufacturer: value.manufacturer ? this.getManufacturerById(value.manufacturer).ref : null, warehouse: this.getWarehouseById(value.warehouse!).ref, purchasePrice: value.purchasePrice ?? 0, sellingPrice: value.sellingPrice ?? 0, quantity: value.quantity ?? 0 } as ItemModel
    if (this.isEditing) {
      this.itemService.editItem(this.data!.id, item)
      return
    }
    debugger;
    this.itemService.addItem(item)
  }


}
