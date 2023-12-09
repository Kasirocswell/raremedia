"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../supabase/client"
import { getUser } from "../../../store/userData"
import Navbar from "@/app/components/Navbar"

interface UserProfileData {
  id: string
  username: string
  email: string
  profile_picture: string
  banner: string
  bio: string
}

const UserProfile = () => {
  const { user } = getUser()
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)

  const fetchImageUrls = async (path: string) => {
    const { data } = supabase.storage.from("pfp").getPublicUrl(path)
    return data?.publicUrl || ""
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.username) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", user.username)
          .single()

        if (error) {
          console.error("Error fetching user profile:", error)
        } else if (data) {
          console.log("USER DATA")
          console.log(data)
          const profilePictureUrl = await fetchImageUrls(data.profile_picture)
          const bannerUrl = await fetchImageUrls(data.banner)
          setUserProfile({ ...data })
        }
      }
    }

    fetchUserProfile()
  }, [user])

  if (!userProfile) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <div>
        <img
          src={userProfile.banner}
          alt="Banner"
          className="w-full rounded-xl"
        />
      </div>
      <div className="mx-auto mt-[100px] ">
        <img
          src={userProfile.profile_picture}
          alt="Profile Picture"
          className="w-[100px] h-[100px] rounded-full"
        />
      </div>
      <div className="flex-col mx-auto text-center">
        <p className="justify-center mt-[20px] text-4xl">
          {userProfile.username}
        </p>
        <p className=" mt-[100px] text-xl">{userProfile.bio}</p>
        <p className="text-xl">Subscriptions</p>
        <p className=" text-xl">Joined</p>
      </div>
    </div>
  )
}

export default UserProfile
