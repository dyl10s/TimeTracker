import { Injectable } from "@angular/core";
import { NbTreeGridDataService, NbTreeGridDataSource, NbTreeGridService, NbTreeGridSortService } from "@nebular/theme";
import { CustomFilterService } from "./customFilterService.service";

@Injectable({
  providedIn: 'root'
})
export class CustomTreeBuilder<T> {
  
    constructor(
      private sortService: NbTreeGridSortService<T>,
      private treeGridService: NbTreeGridService<T>,
      private treeGridDataService: NbTreeGridDataService<T>) {
    }
  
    create<N>(data: N[], filterService: CustomFilterService<T>): NbTreeGridDataSource<T> {
      const dataSource = new NbTreeGridDataSource<T>(
        this.sortService,
        filterService,
        this.treeGridService,
        this.treeGridDataService,
      );
  
      dataSource.setData(data, null);
      return dataSource;
    }
  
}