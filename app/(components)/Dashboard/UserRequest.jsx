import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
const UserRequest = () => {
    return (
        <div className="w-full flex justify-center flex-wrap">
            <Card className="w-[300px] m-3 border bg-slate-100">
                <CardHeader className="w-full flex flex-row justify-between">
                    <div>
                        <CardTitle>User Name</CardTitle>
                        <CardDescription>user email</CardDescription>
                    </div>
                    <div className="flex ">

                        <MdDeleteOutline className='h-6 w-6 text-red-600' />
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <h1 className='mb-2 font-bold text-lg '>User message</h1>
                        <p className=''>kdsnkndkadklaklas</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-[300px] m-3 border bg-slate-100">
                <CardHeader className="w-full flex flex-row justify-between">
                    <div>
                        <CardTitle>User Name</CardTitle>
                        <CardDescription>user email</CardDescription>
                    </div>
                    <div className="flex ">

                        <MdDeleteOutline className='h-6 w-6 text-red-600' />
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <h1 className='mb-2 font-bold text-lg '>User message</h1>
                        <p className=''>kdsnkndkadklaklas</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-[300px] m-3 border bg-slate-100">
                <CardHeader className="w-full flex flex-row justify-between">
                    <div>
                        <CardTitle>User Name</CardTitle>
                        <CardDescription>user email</CardDescription>
                    </div>
                    <div className="flex ">

                        <MdDeleteOutline className='h-6 w-6 text-red-600' />
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <h1 className='mb-2 font-bold text-lg '>User message</h1>
                        <p className=''>kdsnkndkadklaklas</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-[300px] m-3 border bg-slate-100">
                <CardHeader className="w-full flex flex-row justify-between">
                    <div>
                        <CardTitle>User Name</CardTitle>
                        <CardDescription>user email</CardDescription>
                    </div>
                    <div className="flex ">

                        <MdDeleteOutline className='h-6 w-6 text-red-600' />
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <h1 className='mb-2 font-bold text-lg '>User message</h1>
                        <p className=''>kdsnkndkadklaklas</p>
                    </div>
                </CardContent>
            </Card>



        </div>
    )
}

export default UserRequest