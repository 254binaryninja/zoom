//@ts-nocheck

import { cn } from '../lib/utils';
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {  Layout, Users } from 'lucide-react';
import { Button } from './ui/button';
import { useParams, useRouter } from 'next/navigation';
import EndCall from './EndCall'
import Loader from './Loader';


type CallLayout = 'grid' | 'speaker-left'|'speaker-right'

const MeetingRoom = () => {
  const searchParams = useParams();
  const isPersonal = !!searchParams.get('personal');
  const [layout,setLayout] = useState<CallLayout>('speaker-left');
  const [showParticipants,setShowParticipants] = useState(false);
  const router = useRouter();

  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();

  if(callingState !== CallingState.JOINED ) return <Loader/>;

  const CallLayout = () =>{
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout/>;
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition="right"/>
      default :'speaker-right'
        return <SpeakerLayout participantsBarPosition="left"/>     
      break;
    }
  }
  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
       <div className='relative flex size-full items-center justify-center'>
         <div className='flex size-full max-w-[1000px] items-center'>
            <CallLayout/>
         </div>
         <div className={cn('h-[calc(100vh-86px)] hidden ml-2',{'show-block':showParticipants})}>
            <CallParticipantsList onClose={()=>setShowParticipants(false)}/>
         </div>
       </div>
       <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
         <CallControls onLeave={()=>router.push('/')}/>

 <DropdownMenu>
  <div className='flex items-center'>
  <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
    <Layout className='text-white' size={20}/>
  </DropdownMenuTrigger>
  </div>
 
  <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
         {['grid','speaker-left','speaker-right'].map((item,index)=>(
          <div key={index} >
            <DropdownMenuItem className='cursor-pointer' onClick={()=>{
              setLayout(item.toLowerCase() as CallLayout)
            }}>
              {item}
            </DropdownMenuItem>
          </div>
         ))}
    <DropdownMenuSeparator className='border-dark-4' />
    
   </DropdownMenuContent>
  </DropdownMenu>
  
  <CallStatsButton/>

     <Button onClick={()=>setShowParticipants((prev) => !prev)}>
       <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
        <Users className='text-white' size={20}/>
       </div>
     </Button>
        {!isPersonal && <EndCall/>}
       </div>
    </section>
  )
}

export default MeetingRoom