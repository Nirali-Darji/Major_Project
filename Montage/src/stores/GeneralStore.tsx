// import { makeAutoObservable } from "mobx";

// class GeneralStore {
//   selectedPortfolio: string = "";
//   currentDesignName = "untitled";
//   // selectedSubstyleId = {}
//   selectedMaterials: Record<string, any> = {};
//   constructor() {
//     makeAutoObservable(this);
//   }

//   setSelectedPortfolio(portfolio: string) {
//     this.selectedPortfolio = portfolio;
//   }
//   setCurrentDesignName(name: string) {
//     this.currentDesignName = name;
//   }
//   // setSelectedSubstyleId(substyleId: object){
//   //     this.selectedSubstyleId = substyleId;
//   // }
//   setSelectedMaterial(substyleName: string, material: any) {
//     this.selectedMaterials = {
//       ...this.selectedMaterials,
//       [substyleName]: material,
//     };
//   }
// }
// const generalStore = new GeneralStore();

// export default generalStore;


import { makeAutoObservable } from "mobx";

class GeneralStore {
  selectedPortfolio: string = "";
  currentDesignName = "untitled";
  selectedSubstyleId: Record<string, string> = {}; // Store substyleId for each substyle
  selectedMaterials: Record<string, { materialId: string; materialData: any }> = {}; // Store materialId + data

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedPortfolio(portfolio: string) {
    this.selectedPortfolio = portfolio;
  }

  setCurrentDesignName(name: string) {
    this.currentDesignName = name;
  }

  setSelectedSubstyleId(substyleName: string, substyleId: string) {
    this.selectedSubstyleId = {
      ...this.selectedSubstyleId,
      [substyleName]: substyleId,
    };
  }

  
  setSelectedMaterial(substyleName: string, material: any) {
    this.selectedMaterials = {
      ...this.selectedMaterials,
      [substyleName]: {
        materialId: material.id, // Store material ID
        materialData: material,  // Store material details
      },
    };
  }

  


}

const generalStore = new GeneralStore();
export default generalStore;


// import { makeAutoObservable } from "mobx";

// class GeneralStore {
//   selectedPortfolio: string = "";
//   currentDesignName: string = "untitled";
//   configuredStyle: Array<{ subStyleId: number; selectedMaterialId: number }> = []; // ✅ Store structured data

//   constructor() {
//     makeAutoObservable(this);
//   }

//   setSelectedPortfolio(portfolio: string) {
//     this.selectedPortfolio = portfolio;
//   }

//   setCurrentDesignName(name: string) {
//     this.currentDesignName = name;
//   }

//   // ✅ Function to update a substyle's material selection
//   updateConfiguredStyle(subStyleId: number, selectedMaterialId: number) {
//     const index = this.configuredStyle.findIndex((item) => item.subStyleId === subStyleId);

//     if (index > -1) {
//       // ✅ Update existing entry
//       this.configuredStyle[index].selectedMaterialId = selectedMaterialId;
//     } else {
//       // ✅ Add new entry
//       this.configuredStyle.push({ subStyleId, selectedMaterialId });
//     }
//   }

//   // ✅ Function to set the entire configuredStyle array
//   setConfiguredStyles(styles: Array<{ subStyleId: number; selectedMaterialId: number }>) {
//     this.configuredStyle = styles;
//   }
// }

// const generalStore = new GeneralStore();
// export default generalStore;
