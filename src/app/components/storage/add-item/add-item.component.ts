import { Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit, OnDestroy {

  public categories: { name: string, ref: DocumentReference<CategoryModel> }[] = []
  public selectedCategories: { name: string, ref: DocumentReference<CategoryModel> }[] = []
  public manufacturers: { name: string, ref: DocumentReference<ManufacturerModel> }[] = []
  public warehouses: { name: string, ref: DocumentReference<WarehouseModel> }[] = []

  private sub = new Subscription()

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    private warehouseService: WarehouseService) { }

  ngOnInit(): void {
    this.sub.add(this.categoryService.getAllOrganizationCategories().subscribe((categories) => { this.categories = categories.map(c => { return { name: c.data()?.name ?? "", ref: c.ref } }) }))
    this.sub.add(this.addItemForm.controls['category'].valueChanges.subscribe(v => { this.selectedCategories = v ?? [] }))
    this.sub.add(this.manufacturerService.getAllManufacturersInOrganization().subscribe((m) => {
      this.manufacturers = m.map(m => { return { name: m.data()?.name ?? "", ref: m.ref } })
    }))
    this.sub.add(this.warehouseService.getAllWarehousesInOrganization().subscribe((warehouses) => {
      this.warehouses = warehouses.map(w => { return { name: w.data()?.name ?? "", ref: w.ref } })
    }))
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }


  addItemForm = new FormGroup({
    itemName: new FormControl('', [Validators.required]),
    sku: new FormControl('', [Validators.required]),
    upc: new FormControl('', [Validators.required]),
    summary: new FormControl(''),
    category: new FormControl<{ name: string, ref: DocumentReference<CategoryModel> }[] | null>(null),
    manufacturer: new FormControl<{ name: string, ref: DocumentReference<ManufacturerModel> } | null>(null),
    warehouse: new FormControl<{ name: string, ref: DocumentReference<WarehouseModel> } | null>(null, [Validators.required]),
    purchasePrice: new FormControl(null, [Validators.required]),
    sellingPrice: new FormControl(null, [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
  })

  onSubmit(value: Partial<{ itemName: string | null; sku: string | null; upc: string | null; summary: string | null; category: { name: string; ref: DocumentReference<CategoryModel>; }[] | null; manufacturer: { name: string; ref: DocumentReference<ManufacturerModel>; } | null; warehouse: { name: string; ref: DocumentReference<WarehouseModel>; } | null; sellingPrice: number | null; purchasePrice: number | null; quantity: number | null; }>) {
    debugger;
    this.itemService.addItem(value.itemName ?? "", value.sku ?? "", value.upc ?? "", value.summary ?? "", value.category?.map(c => c.ref) ?? [], value.manufacturer?.ref, value.warehouse!.ref, value.purchasePrice ?? 0, value.sellingPrice ?? 0, value.quantity ?? 0)
  }

}
