import { Navigate, Route, Routes } from 'react-router-dom'
import { Analysis } from './screens/Analysis'
import { Auth } from './screens/Auth'
import { Chat } from './screens/Chat'
import { Chats } from './screens/Chats'
import { Landing } from './screens/Landing'
import { Mates } from './screens/Mates'
import { Notifications } from './screens/Notifications'
import { Profile } from './screens/Profile'
import { Report } from './screens/Report'
import { Splash } from './screens/Splash'
import { Timetable } from './screens/Timetable'

export default function App() {
  return (
    <div className="stage">
      <div className="phone">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/welcome" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/mates" element={<Mates />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analysis/report" element={<Report />} />
          <Route path="/chat/:mateId" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
