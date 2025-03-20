import { makeAutoObservable } from "mobx";

class GeneralStore {
  selectedPortfolio: string = "";
  currentDesignName: string = "untitled";
  configuredStyle: Array<{ subStyleId: number; selectedMaterialId: number }> = []; 

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedPortfolio(portfolio: string) {
    this.selectedPortfolio = portfolio;
  }

  setCurrentDesignName(name: string) {
    this.currentDesignName = name;
  }

  updateConfiguredStyle(subStyleId: number, selectedMaterialId: number) {
    const index = this.configuredStyle.findIndex((item) => item.subStyleId === subStyleId);

    if (index > -1) {
      this.configuredStyle[index].selectedMaterialId = selectedMaterialId;
    } else {
      this.configuredStyle.push({ subStyleId, selectedMaterialId });
    }
  }

  setConfiguredStyles(styles: Array<{ subStyleId: number; selectedMaterialId: number }>) {
    this.configuredStyle = styles;
  }
}

const generalStore = new GeneralStore();
export default generalStore;
