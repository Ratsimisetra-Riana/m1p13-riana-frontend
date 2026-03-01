import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ShopAdminService } from '../../services/shop-admin.service';
import { CategoryService, Category } from '../../services/category.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-shop-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html'
})
export class ShopAddProductComponent {
  model: any = { name: '', categoryId: null, basePrice: 0, images: [], variants: [] };
  categories: Category[] = [];
  
  // File handling
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  existingImages: string[] = [];
  uploading = false;

  constructor(
    private productService: ProductService,
    private shopAdmin: ShopAdminService,
    private categoryService: CategoryService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // Load categories on init
    this.categoryService.list().subscribe((cats: Category[]) => {
      this.categories = cats || [];
    });
  }

  compareCategories(c1: any, c2: any): boolean {
    return c1?._id === c2?._id;
  }

  /**
   * Handle file selection from input
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      
      // Validate files
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`Le fichier ${file.name} dépasse 5MB`);
          continue;
        }
        
        if (!file.type.startsWith('image/')) {
          alert(`Le fichier ${file.name} n'est pas une image`);
          continue;
        }
        
        this.selectedFiles.push(file);
        
        // Generate preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Reset input
    input.value = '';
  }

  /**
   * Remove selected image
   */
  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  /**
   * Remove existing image (for edit mode)
   */
  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
  }

  addVariant() {
    const attributes: any = {};
    if (this.model.categoryId?.filters) {
      this.model.categoryId.filters.forEach(filter => {
        attributes[filter.key] = '';
      });
    }
    this.model.variants.push({ sku: '', stock: 0, attributes, price: undefined });
  }

  removeVariant(index: number) {
    this.model.variants.splice(index, 1);
  }

  submit() {
    this.uploading = true;

    const uploadImages = async () => {
      // Combine existing images with newly uploaded ones
      const allImages = [...this.existingImages];

      if (this.selectedFiles.length > 0) {
        try {
          // Upload files to Supabase
          const urls = await this.supabaseService.uploadFiles(this.selectedFiles).toPromise();
          if (urls) {
            allImages.push(...urls);
          }
        } catch (error) {
          console.error('Error uploading images:', error);
          alert('Erreur lors du téléchargement des images');
          this.uploading = false;
          return;
        }
      }

      return allImages;
    };

    uploadImages().then((imageUrls) => {
      if (imageUrls === undefined) return; // Error occurred

      this.model.images = imageUrls;

      const shop = this.shopAdmin.getShop();
      if (shop) this.model.shopId = shop.id;

      this.productService.addProduct(this.model).subscribe({
        next: () => {
          this.uploading = false;
          this.router.navigate(['/shop-admin/products']);
        },
        error: (err) => {
          console.error('Error adding product:', err);
          this.uploading = false;
          alert('Erreur lors de l\'ajout du produit');
        }
      });
    });
  }
}
