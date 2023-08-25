import { useContext } from "react";
import { HandPalm, Play } from "phosphor-react";
import * as zod from 'zod';
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';

import { 
  // CountdownContainer, 
  // FormContainer,
  // TaskInput,
  // MinutesAmountInput,
  HomeContainer, 
  // Separator,
  StartCountdownButton,
  StopCountdownButton
} from "./styles";
import { CountDown } from "./CountDown";
import { NewCycleForm } from "./NewCycleForm";
import { CyclesContext } from "../../contexts/CyclesContext";

//schema de validacao
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
  .number()
  .min(1, 'O ciclo precisa ser no minimo 05 minutos')
  .max(60, 'O ciclo precisa ser no máximo 60 minutos'),
})

//type inferindo do schema
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


//interfaces



//context


export function Home(){

  //contexto
  const { createNewCycle, interruptCurrentCycle, activeCycle } = useContext(CyclesContext)
   
  //HookForm e Zod
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const { handleSubmit, watch, reset} = newCycleForm
  

  function handleCreateNewCycle(data: NewCycleFormData){
    createNewCycle(data)
    reset()

  }

  //watch
  const task = watch('task')
  const isSubmitDisabled = !task;


  return(
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
       
    
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        
        <CountDown />



        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}