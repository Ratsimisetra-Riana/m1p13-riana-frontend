import {  FilterDef } from '../services/category.service';

export interface CategoryDTO { 
    _id?: string; 
    name: string; 
    parent?: string  | null; 
    filters?: FilterDef[] 
}