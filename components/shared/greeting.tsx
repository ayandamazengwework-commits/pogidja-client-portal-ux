'use client'

import { useEffect, useState } from 'react'

interface GreetingProps {
  name: string
}

export function Greeting({
  name,
}: GreetingProps) {
  const [greeting, setGreeting] = useState('Welcome')

  useEffect(() => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good Evening')
    } else {
      setGreeting('Welcome Back')
    }
  }, [])

  return (
    <div>
      <p className="text-sm text-slate-500">
        {greeting} 👋
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        {name}
      </h1>

      <p className="mt-3 text-slate-600">
        Here's an overview of your practice today.
      </p>
    </div>
  )
}
