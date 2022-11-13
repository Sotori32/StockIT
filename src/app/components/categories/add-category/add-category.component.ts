import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryDisplayModel, CategoryModel } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  public isEditing: boolean = !!this.data;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CategoryDisplayModel | undefined,
    private categoryService: CategoryService) { }

  ngOnInit(): void { }

  addCategoryForm = new FormGroup({
    name: new FormControl(this.isEditing && this.data && this.data.name ? this.data.name : '', [Validators.required]),
  })

  onSubmit(data: Partial<{name: string | null}>) {
    const category = {name: data.name ?? ""} as CategoryModel;
    if (this.isEditing && this.data) {
      this.categoryService.editCategory(this.data?.id, category);
      return
    }
    this.categoryService.addCategory(category);
  }

}
