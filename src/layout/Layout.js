import Sidebar from "../components/Sidebar"

const Layout=props=>{
    return(
        <div>
            <Sidebar/>
            {props.children}
        </div>
         
    )
}
export default Layout