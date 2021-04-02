import { NbTreeGridFilterService } from "@nebular/theme";

export class CustomFilterService<T> extends NbTreeGridFilterService<T> {

    filteredColumns : string[]

    constructor() {
        super();
    }

    setFilterColumns(columns: string[]) {
        this.filteredColumns = columns;
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