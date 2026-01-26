"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Provider({ children }: { children: React.ReactNode }) {

    const [userDetail, setUserDetail] = useState(null)

    useEffect(() => {
        CreateNewUser()
    }, [])
    
    const CreateNewUser = async () => {
        // user API endpoint call to create a new user
        const result = await axios.post('/api/user', {});
        console.log(result.data)
        setUserDetail(result?.data);
    }

    return (
        <div>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                <div className='max-w-7xl mx-auto'>
                    {children}
                </div>
            </UserDetailContext.Provider>
        </div>
    )
}

export default Provider