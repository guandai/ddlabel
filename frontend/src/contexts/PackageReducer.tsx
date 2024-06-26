
export interface Package {
    id: number;
    name: string;
}

export interface PackageState {
    packages: Package[];
}
  
export interface PackageAction {
    type: 'SET_PACKAGES' | 'ADD_PACKAGE' | 'REMOVE_PACKAGE' | 'UPDATE_PACKAGE';
    payload: Package | Package[] | number;
}

export const packageReducer = (state: PackageState, action: PackageAction): PackageState => {
    switch (action.type) {
        case 'SET_PACKAGES':
            return { ...state, packages: action.payload as Package[] };
        case 'ADD_PACKAGE':
            return { ...state, packages: [...state.packages, action.payload as Package] };
        case 'REMOVE_PACKAGE':
            return { ...state, packages: state.packages.filter(pkg => pkg.id !== (action.payload as number)) };
        case 'UPDATE_PACKAGE':
            return {
                ...state,
                packages: state.packages.map(pkg =>
                    pkg.id === (action.payload as Package).id ? (action.payload as Package) : pkg
                )
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};
