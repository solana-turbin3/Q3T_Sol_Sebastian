import { create } from 'zustand';
import {Xero} from "@/lib/solana-program/idl";
import * as anchor from "@coral-xyz/anchor"

interface XeroState {
    program: anchor.Program<Xero> | undefined,
    setProgram: (program: anchor.Program<Xero>) => void,
}

export const useStore = create<XeroState>()((set) => ({
    program: undefined,
    setProgram : (program) => set(() => ({ program: program}))
}))