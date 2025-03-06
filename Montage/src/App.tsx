import Leftbar from "./components/Leftbar"
import Navbar from "./components/Navbar"
import Toolbar from "./components/Toolbar"

function App() {

  return (
    <>
      {/* <div className="bg-red-500">Hello World</div> */}
      <div>
        <Navbar/>
        <div>
        <Leftbar/>
        <Toolbar/>
        </div>
        
      </div>

    </>
  )
}

export default App
