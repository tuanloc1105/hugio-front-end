import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Category } from '@ims/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'ims-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  template: `<form [formGroup]="validateForm" (ngSubmit)="submitForm()">
    <div class="flex flex-col gap-5">
      <div class="flex gap-3">
        <div class="flex flex-col gap-1 w-1/2">
          <label htmlFor="name" class="block text-gray-300 text-sm font-bold"
            >Name</label
          >
          <input
            pInputText
            id="name"
            aria-describedby="name-help"
            formControlName="product_name"
          />
        </div>
        <div class="flex flex-col gap-1 w-1/2">
          <label
            htmlFor="description"
            class="block text-gray-300 text-sm font-bold"
            >Description</label
          >
          <input
            pInputText
            id="description"
            aria-describedby="description-help"
            formControlName="product_description"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <div class="flex flex-col gap-1 w-1/2">
          <label htmlFor="price" class="block text-gray-300 text-sm font-bold"
            >Price</label
          >
          <p-inputNumber
            inputId="price"
            formControlName="price"
            styleClass="w-full"
          ></p-inputNumber>
        </div>
        <div class="flex flex-col gap-1 w-1/2">
          <label
            htmlFor="discount"
            class="block text-gray-300 text-sm font-bold"
            >Discount</label
          >
          <p-inputNumber
            inputId="discount"
            formControlName="discount"
            styleClass="w-full"
          ></p-inputNumber>
        </div>
      </div>

      <div class="flex gap-3">
        <div class="flex flex-col gap-1 w-1/2">
          <label
            htmlFor="quantity"
            class="block text-gray-300 text-sm font-bold"
            >Quantity</label
          >
          <p-inputNumber
            inputId="quantity"
            formControlName="product_quantity"
            styleClass="w-full"
          ></p-inputNumber>
        </div>
        <div
          class="flex flex-col gap-1 w-1/2"
          *ngIf="categories$ | async as categories"
        >
          <label
            htmlFor="categories"
            class="block text-gray-300 text-sm font-bold"
            >Categories</label
          >
          <p-multiSelect
            [options]="categories"
            formControlName="categories"
            optionLabel="category_name"
            id="categories"
            styleClass="w-full"
            optionValue="category_name"
            appendTo="body"
          ></p-multiSelect>
        </div>
      </div>
      <p-button
        [label]="modalType"
        type="submit"
        styleClass="p-button-success"
      ></p-button>
    </div>
  </form> `,
  styles: [],
})
export class ProductDialogComponent implements OnInit {
  readonly fb = inject(UntypedFormBuilder);
  readonly productService = inject(ProductService);
  readonly ref = inject(DynamicDialogRef);

  readonly categories$: Observable<Category[]> =
    this.productService.queryListCategory();

  public validateForm!: UntypedFormGroup;
  public modalType = 'Create';

  constructor(public modalConfig: DynamicDialogConfig) {
    this.modalType = modalConfig.data.type;
    if (modalConfig.data.data) {
      const product = modalConfig.data.data;
      this.validateForm.patchValue({
        product_name: product.product_name,
        product_description: product.product_description,
        price: product.price,
        discount: product.discount,
        product_quantity: product.product_quantity,
        categories: product.categories.map((item: any) => item.category_name),
      });
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  public submitForm(): void {
    if (this.validateForm.valid) {
      if (this.modalType === 'Create') {
        this.productService.createProduct(this.validateForm.value).subscribe({
          next: () => {
            this.ref.close(true);
          },
          error: (e) => {
            console.log(e);
          },
        });
      } else {
        this.productService
          .updateProduct({
            ...this.validateForm.value,
            product_uid: this.modalConfig.data.data.product_uid,
          })
          .subscribe({
            next: () => {
              this.ref.close(true);
            },
            error: (e) => {
              console.log(e);
            },
          });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  public clearForm() {
    this.validateForm.reset();
  }

  private initForm() {
    this.validateForm = this.fb.group({
      product_name: [null, [Validators.required]],
      product_description: [null, [Validators.required]],
      price: [null, [Validators.required]],
      discount: [null, [Validators.required]],
      product_quantity: [null, [Validators.required]],
      categories: [null, [Validators.required]],
    });
  }
}