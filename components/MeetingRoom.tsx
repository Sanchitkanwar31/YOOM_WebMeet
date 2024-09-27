"use client";

import { cn } from '@/lib/utils';
import { Call, CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';


type CallLayout ='grid'|'speaker-left'|'speaker-right'

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayout>('speaker-left');
  const [showParticipants, setshowParticipants] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');

  const { useCallCallingState } = useCallStateHooks();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

 
  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
        <div className="relative flex size-full items-center justify-center">
          <div className="flex size-full max-w-[1000px]">
              <CallLayout />
          </div>

          <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
        <CallParticipantsList onClose={() => setshowParticipants(false)} />
        </div>

        </div>

        <div className="fixed bottom-0 flex w-full items-center flex-wrap justify-center gap-5">
            <CallControls />
            <DropdownMenu>
              <div className="flex items-center">

                <DropdownMenuTrigger> 
                  <LayoutList size={20}
                className="text-white justify-center"/>Layout
                </DropdownMenuTrigger>
              </div>
            
                <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white"> 
                  {['Grid','Speaker-Left','Speaker-Right'].map((item, index) => (
                  <div key={index}>
                    <DropdownMenuItem  className="cursor-pointer" onClick={() => {
                    setLayout(item.toLowerCase() as CallLayout)}}>
                      {item}</DropdownMenuItem>
                    {/* <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
              */}
                  </div>
                ))}
                  {/* <DropdownMenuSeparator  className="border-dark-1/>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                </DropdownMenuContent>
            </DropdownMenu>
            <CallStatsButton />
            <button onClick={() => setshowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
            Participants
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton/>}

        </div>
    </section>
  )
}

export default MeetingRoom