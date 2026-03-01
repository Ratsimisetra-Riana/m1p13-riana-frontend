import { Routes } from '@angular/router';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { ProductPage } from './components/product-page/product-page';
import { ProductDetailsPage } from './components/product-details-page/product-details-page';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PurchaseHistoryComponent } from './components/history/purchase-history.component';
import { ShopListComponent } from './components/shops/shop-list.component';
import { ShopProductsComponent } from './components/shops/shop-products.component';
import { ShopAdminLoginComponent } from './components/shop-admin/login.component';
import { ShopDashboardComponent } from './components/shop-admin/dashboard.component';
import { ShopProfileComponent } from './components/shop-admin/profile.component';
import { ShopAddProductComponent } from './components/shop-admin/add-product.component';
import { ShopProductListComponent } from './components/shop-admin/product-list.component';
import { ShopProductEditComponent } from './components/shop-admin/product-edit.component';
import { ShopSoldProductsComponent } from './components/shop-admin/sold-products.component';
import { ShopOrdersComponent } from './components/shop-admin/orders.component';
import { ShopAdminLayout } from './components/layout/shop-admin-layout/shop-admin-layout';
import { CentreAdminLayout } from './components/layout/centre-admin-layout/centre-admin-layout';
import { CentreCategoryListComponent } from './components/centre-admin/category-list.component';
import { CentreCategoryEditComponent } from './components/centre-admin/category-edit.component';
import { CentreBoxListComponent } from './components/centre-admin/box-list.component';
import { CentreBoxEditComponent } from './components/centre-admin/box-edit.component';
import { CentreShopListComponent } from './components/centre-admin/shop-list.component';
import { CentreShopEditComponent } from './components/centre-admin/shop-edit.component';
import { CentreUserListComponent } from './components/centre-admin/user-list.component';
import { CentreUserEditComponent } from './components/centre-admin/user-edit.component';
import { shopAdminGuard } from './services/shop-admin.guard';
import { centreAdminGuard } from './services/centre-admin.guard';

export const routes: Routes = [
  { path: 'articles', component: ArticleListComponent }, // Route pourarticle-list
  //{ path: '', redirectTo: 'articles', pathMatch: 'full' } // Redirection par défaut
  {
      path: '',
      component: MainLayout,
      children: [
        { path: '', redirectTo: 'products', pathMatch: 'full' }, // default
        { path: 'products', component: ProductPage },
        { path: 'products/:id', component: ProductDetailsPage },
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path: 'cart', component: CartComponent },
        { path: 'checkout', component: CheckoutComponent },
        { path: 'history', component: PurchaseHistoryComponent },
        { path: 'shops', component: ShopListComponent },
        { path: 'shops/:id/products', component: ShopProductsComponent }
      ]
    }
  ,
    // shop admin area - protected by shopAdminGuard
    {
      path: 'shop-admin',
      component: ShopAdminLayout,
      canActivate: [shopAdminGuard],
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'login', component: ShopAdminLoginComponent },
        { path: 'dashboard', component: ShopDashboardComponent },
        { path: 'profile', component: ShopProfileComponent },
        { path: 'add-product', component: ShopAddProductComponent },
        { path: 'products', component: ShopProductListComponent },
        { path: 'products/:id', component: ShopProductEditComponent },
        { path: 'sold', component: ShopSoldProductsComponent },
        { path: 'orders', component: ShopOrdersComponent }
      ]
    }
    ,
    // centre admin area - protected by centreAdminGuard
    {
      path: 'centre-admin',
      component: CentreAdminLayout,
      canActivate: [centreAdminGuard],
      children: [
        { path: '', redirectTo: 'categories', pathMatch: 'full' },
        { path: 'categories', component: CentreCategoryListComponent },
        { path: 'categories/:id', component: CentreCategoryEditComponent },
        { path: 'boxes', component: CentreBoxListComponent },
        { path: 'boxes/:id', component: CentreBoxEditComponent },
        { path: 'shops', component: CentreShopListComponent },
        { path: 'shops/:id', component: CentreShopEditComponent },
        { path: 'users', component: CentreUserListComponent },
        { path: 'users/:id', component: CentreUserEditComponent }
      ]
    }
];
