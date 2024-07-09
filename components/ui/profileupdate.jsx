"use client"
import * as React from 'react';
import * as HoverData from '@radix-ui/react-hover-card'
import { cn } from '@/lib/utils';
const ProfileUpdate=HoverData.Root;
const ProfileUpdateTrigger=HoverData.Trigger;
const ProfileUpdatePortal=HoverData.Portal;
const ProfileUpdateContent=HoverData.Content;
const ProfileUpdateArrow=HoverData.Arrow;

const ProfileUpdateContentData=React.forwardRef(({className,sideOffset = 4,...props},ref)=>{
   return( <HoverData.Portal>
    <HoverData.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </HoverData.Portal>)
})

ProfileUpdateContentData.displayName=HoverData.Content.displayName;

export{
    ProfileUpdate,
    ProfileUpdateTrigger,
    ProfileUpdatePortal,
    ProfileUpdateContent,
    ProfileUpdateArrow,
    ProfileUpdateContentData
}


