import { createContext, useContext } from 'react';
import ActivityStre from './activityStore';
import CommonStore from './commonStore';

interface Store {
    activityStore: ActivityStre;
    commonStore: CommonStore;
}

export const store: Store = {
    activityStore: new ActivityStre(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}