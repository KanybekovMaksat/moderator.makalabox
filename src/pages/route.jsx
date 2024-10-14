import { Route, Routes } from 'react-router-dom'
import  Profile  from './ModeratorPage'
import Login from './Login'
import Examinations from './Examinations'
import LoadingAnimation from '../assets/components/Loading/Loading'
import Basket from "./BasketPage"
import Serach from "./SearchPage"

const Routing = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/moderator-page' element={<Profile/>}/>
        <Route path='/examination/:id' element={<Examinations/>}/>        
        <Route path='/basket-page' element={<Basket/>}/>        
        <Route path='/search-page' element={<Serach/>}/>        
      </Routes>
    </>
  )
}

export default Routing
