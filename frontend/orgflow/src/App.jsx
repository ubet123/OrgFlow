import { BrowserRouter, Route, Routes } from "react-router"
import Login from "./pages/Login"
import ManagerDash from "./pages/ManagerDash"
import EmployeeDash from "./pages/EmployeeDash"


function App() {
  

  return (
    <>
       <BrowserRouter>
       <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/manager-dashboard" element={<ManagerDash/>}/>
        <Route path="/employee-dashboard" element={<EmployeeDash/>} />
       </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
