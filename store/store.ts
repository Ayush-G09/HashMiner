import {configureStore} from '@reduxjs/toolkit';
import minerReducer from './minerSlice';

const store = configureStore({
  reducer: {
    miner: minerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
