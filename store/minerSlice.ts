import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MinerCardType } from '../components/MinerCard';


type MinerDataType = {
    balance: number;
    miners: MinerCardType[];
    coinPrice: {labels: string[], datasets: {data: number[]}[]};
  };

const initialState: MinerDataType = {
  balance: 0,
  miners: [],
  coinPrice: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fir', 'Sat', 'Sun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  },
};

const minerSlice = createSlice({
  name: 'miner',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setMiners: (state, action: PayloadAction<MinerCardType[]>) => {
      state.miners = action.payload; // Replace all miners at once
    },
    setCoinPrice: (state, action: PayloadAction<{labels: string[], datasets: {data: number[]}[]}>) => {
      state.coinPrice = action.payload;
    },
    resetCoinsMinedById: (state, action: PayloadAction<string>) => {
      state.miners = state.miners.map((miner: MinerCardType) =>
        miner._id === action.payload ? { ...miner, coinsMined: 0, status: 'Running' } : miner
      );
    },
  }, 
});

export const { setBalance, setMiners, setCoinPrice, resetCoinsMinedById } = minerSlice.actions;
export default minerSlice.reducer;
