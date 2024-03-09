
import { MdOutlineCancel } from "react-icons/md";

function CircleImage({icon}) {
    const Icon = icon || MdOutlineCancel
  return (
    <div className="centerCircle"> 
        <label className="labelCircle">
            <Icon className="icons" />
        </label>
    </div>
    
  )
}

export default CircleImage