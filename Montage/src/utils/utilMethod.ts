interface Module {
    id: string;
    moduleType: {
      name: string;
    };
    title: string;
  }
  
  /**
   * Filters modules by a search term matching the module title or type name.
   * @param modules - The array of modules to filter.
   * @param searchTerm - The search term to match.
   * @returns Filtered modules matching the search term.
   */
  export const filterModules = (modules: Module[], searchTerm: string): Module[] => {
    if (!searchTerm) return modules;
  
    const lowerCaseTerm = searchTerm.toLowerCase();
  
    return modules.filter(
      (module) =>
        module.title.toLowerCase().includes(lowerCaseTerm) ||
        module.moduleType.name.toLowerCase().includes(lowerCaseTerm)
    );
  };
  