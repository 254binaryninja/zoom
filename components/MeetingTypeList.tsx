"use client"

import { useRouter } from "next/navigation"
import HomeCard from "./HomeCard"
import { useState } from "react"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "./ui/button"


const MeetingTypeList = () => {
   const {toast} = useToast(); 
   const router = useRouter(); 
   const [meetingState,setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
   const {user} = useUser();
   const client = useStreamVideoClient();
   const [values,setValues] = useState({
    dateTime:new Date(),
    description:'',
    link:'',
   });
   const [callDetails,setCallDetails] = useState<Call>();

   console.log(user);
   console.log(client);

   const createMeeting = async ()=>{
    if(!client || !user) return;

    try{
    if(!values.dateTime){
      toast({title:'Please select a date and time'})
    }
     
    const id = crypto.randomUUID();
    const call = client.call('default',id);

    if(!call) throw new Error("Failed to Initialize call");
    const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
    const description = values.description || "Instant Meeting";

    await call.getOrCreate({
      data:{
        starts_at:startsAt,
        custom:{
          description
        }
      }
    })
    setCallDetails(call);

    if(!values.description) {
      router.push(`/meeting/${call.id}`);
    }
    toast({title:'Meeting created successfully'})
    }catch(error){
      console.log(error)
      toast({title:'Failed to create Meeting'})
    }
   }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
       img="/icons/add-meeting.svg"
       title="New Meeeting"
       description="Start an Instant Meeting"
       handleClick={()=> setMeetingState('isInstantMeeting')}
       className="bg-orange-1"
      />
      <HomeCard
       img="/icons/schedule.svg"
       title="Schedule Meeeting"
       description="Plan a  Meeting"
       handleClick={()=> setMeetingState('isScheduleMeeting')}
       className="bg-blue-1"
      />
      <HomeCard
       img="/icons/recordings.svg"
       title="View Recordings"
       description="Check out recordings"
       handleClick={()=> router.push('/recordings')}
       className="bg-purple-1"
       />
      <HomeCard 
       img="/icons/join-meeting.svg"
       title="Join Meeeting"
       description="via Invitation Link"
       handleClick={()=> setMeetingState('isJoiningMeeting')}
       className="bg-yellow-1"
      />

      <MeetingModal
      isOpen={meetingState === 'isInstantMeeting'}
      onClose={()=>setMeetingState(undefined)}
      title="Start an Instant Meeting"
      className="text-center"
      buttonText="Start Meeting"
      handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList