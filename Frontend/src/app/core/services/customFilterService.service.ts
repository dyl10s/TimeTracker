import { NbTreeGridFilterService, NbTreeGridPresentationNode } from "@nebular/theme";

export class CustomFilterService<T> extends NbTreeGridFilterService<T> {

    filteredColumns : string[]
    lastFilter: string;

    constructor() {
        super();
    }

    setFilterColumns(columns: string[]) {
        this.filteredColumns = columns;
    }
    
    filter(query: string, data: NbTreeGridPresentationNode<T>[]): NbTreeGridPresentationNode<T>[] {     
      if (!query) {
        return data;
      }

      // Logic to fix the nebular bug
      let isNewFilter = true;
      if(this.lastFilter == query) {
        isNewFilter = false;
      }
      this.lastFilter = query;

      return data.reduce((filtered: NbTreeGridPresentationNode<T>[], node: NbTreeGridPresentationNode<T>) => {
        let filteredChildren: NbTreeGridPresentationNode<T>[];
  
        if (node.children) {
          filteredChildren = this.filter(query, node.children);
          node.children = filteredChildren;
        }
  
        /* 
        Logic to fix the nebular bug I hate this but 
        for some reason after filtering nebular decides that 
        it can no longer handle swapping the expanded status on its own...
        and I don't feel like extending a different nebular service to fix this
        bug in the correct spot. 
        */
        if(isNewFilter) {
          node.expanded = false;
        }else{
          node.expanded = !node.expanded;
        }

        if (filteredChildren && filteredChildren.length) {

          // Logic to fix the nebular bug
          if(isNewFilter) {
            node.expanded = true;
          }

          filtered.push(node);
        } else if (this.filterPredicate(node.data, query)) {
          filtered.push(node);
        }
  
        return filtered;
      }, []);
    }

    filterPredicate(data: T, searchString: string) : boolean {
      
      searchString = searchString.trim().toLocaleLowerCase();
  
      let foundMatch = false;

      this.filteredColumns.forEach(x => {
          if(data[x] && data[x].trim().toLocaleLowerCase().includes(searchString)){
            foundMatch = true;
          }
      });
  
      return foundMatch;
    }
  
}