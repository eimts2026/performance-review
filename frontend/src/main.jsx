import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'



function MissedGoal() {
  return <h1>Missed!</h1>
}

function MadeGoal() {
  return <h1>Goal!</h1>
}

function Goal(props) {
  const isGoal = props.isGoal
  if (isGoal) {
    return <MadeGoal />
  }
  return <MissedGoal />
}

createRoot(document.getElementById('root')).render(
  <>
    <Goal isGoal={false} />
  </>
)
