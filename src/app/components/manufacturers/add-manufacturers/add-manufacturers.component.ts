import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryDisplayModel } from 'src/app/models/category.model';
import { ManufacturerDisplayModel, ManufacturerModel } from 'src/app/models/manufacturer.model';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';

@Component({
  selector: 'app-add-manufacturers',
  templateUrl: './add-manufacturers.component.html',
  styleUrls: ['./add-manufacturers.component.css']
})
export class AddManufacturersComponent implements OnInit {

  public isEditing: boolean = !!this.data;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ManufacturerDisplayModel | undefined,
    private manufacturerService: ManufacturerService) { }

  ngOnInit(): void { }

  addManufacturerForm = new FormGroup({
    name: new FormControl(this.isEditing && this.data && this.data.name ? this.data.name : '', [Validators.required]),
  })

  onSubmit(value: Partial<{ name: string | null }>) {
    const manufacturer = { name: value.name ?? "" } as ManufacturerModel;
    if (this.isEditing && this.data) {
      this.manufacturerService.editManufacturer(this.data?.id, manufacturer);
      return
    }
    this.manufacturerService.addManufacturer(manufacturer);
  }

}
