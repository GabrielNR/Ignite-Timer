import { ReactNode, createContext, useState, useReducer, useEffect } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined;
  activeCycleId: string | null
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children 
}: CyclesContextProviderProps){ 
   const [cyclesState, dispatch] = useReducer(cyclesReducer, {
      cycles: [],
      activeCycleId: null
   },
   (initialState) => {
    //storage
    const storageStateAsJSON = localStorage.getItem(
      '@ignite-timer:cycles-state-1.0.0'
    )
    if(storageStateAsJSON){
      return JSON.parse(storageStateAsJSON)
    }

    return initialState
   })

  const { cycles, activeCycleId } = cyclesState
  //com base do cyclo ativo percorrer todos os cyclos e retornar qual o cyclo que tem o mesmo ID
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)


  //estados
  const [amountSecondsPassed, setAmountSecondPassed] = useState(() => {
    if(activeCycle){
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }


    return 0
  })

  //useEffect
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])


  //funcões
  function setSecondsPassed(seconds: number){
    setAmountSecondPassed(seconds)
  }

  function markCurrentCycleAsFinished(){
    dispatch(markCurrentCycleAsFinishedAction())
    // setCycles(state => state.map((cycle) => {
    //   if(cycle.id === activeCycleId) {
    //     return { ...cycle, finishedDate: new Date() }
    //   } else {
    //     return cycle
    //   }
    // }))
  }

  function createNewCycle(data: CreateCycleData){
    const id =  String(new Date().getTime())
    
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    dispatch(addNewCycleAction(newCycle))

    //sempre passar como uma funcao para o estado quando depende da versao anterior 
    // setCycles((state) => [...state, newCycle])
    setAmountSecondPassed(0)
  }

  function interruptCurrentCycle(){
    dispatch(interruptCurrentCycleAction())
  }


  return (
    <CyclesContext.Provider 
      value={{ 
        cycles,
        activeCycle, 
        activeCycleId, 
        markCurrentCycleAsFinished, 
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}