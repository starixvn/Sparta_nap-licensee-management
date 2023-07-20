import { createContext, useContext } from 'react';

const dropDownContext = createContext();

const { Provider } = dropDownContext;

export const useDropdownContext = () => useContext(dropDownContext);

export default Provider;