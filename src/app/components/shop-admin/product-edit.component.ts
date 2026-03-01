import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ShopAdminService } from '../../services/shop-admin.service';
import { CategoryService, Category } from '../../services/category.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-shop-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-edit.component.html'
})
export class ShopProductEditComponent implements OnInit {
  id: string | null = null;
  model: any = { name: '', categoryId: null, basePrice: 0, images: [], variants: [] };
  categories: Category[] = [];
  
  // File handling
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  existingImages: string[] = [];
  uploading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shopAdmin: ShopAdminService,
    private categoryService: CategoryService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    
    // Load categories
    this.categoryService.list().subscribe((cats: Category[]) => {
      this.categories = cats || [];
      
      // After categories are loaded, load product if editing
      if (this.id && this.id !== 'new') {
        this.productService.getProductsById(this.id).subscribe(
          (product: any) => {
            if (product) {
              this.model = product;
              // Ensure variants array exists and has attributes initialized
              if (!this.model.variants) {
                this.model.variants = [];
              } else if (Array.isArray(this.model.variants)) {
                this.model.variants.forEach((v: any) => {
                  if (!v.attributes) v.attributes = {};
                });
              }
              // Setup existing images
              if (this.model.images && Array.isArray(this.model.images)) {
                this.existingImages = [...this.model.images];
              }
            }
          }
        );
      }
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
   * Remove selected image (new)
   */
  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  /**
   * Remove existing image
   */
  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
  }

  addVariant() {
    // Ensure variants array exists
    if (!this.model.variants) {
      this.model.variants = [];
    }
    
    const attributes: any = {};
    if (this.model.categoryId?.filters && Array.isArray(this.model.categoryId.filters)) {
      this.model.categoryId.filters.forEach((filter: any) => {
        attributes[filter.key] = '';
      });
    }
    
    this.model.variants.push({ sku: '', stock: 0, attributes, price: undefined });
  }

  removeVariant(index: number) {
    this.model.variants.splice(index, 1);
  }

  save() {
    this.uploading = true;

    const uploadImages = async () => {
      // Use existing images that weren't removed
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
      this.model.shopId = shop?.id || '';

      if (this.id && this.id !== 'new') {
        this.productService.updateProduct(this.id, this.model).subscribe({
          next: () => {
            this.uploading = false;
            this.router.navigate(['/shop-admin/products']);
          },
          error: (err) => {
            console.error('Error updating product:', err);
            this.uploading = false;
            alert('Erreur lors de la mise à jour du produit');
          }
        });
      } else {
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
      }
    });
  }

  delete() {
    if (this.id && this.id !== 'new' && confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(this.id).subscribe(
        () => this.router.navigate(['/shop-admin/products'])
      );
    }
  }
}
