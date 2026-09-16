import "./BackButton.css"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button className="dsx-back" type="button" onClick={()=>(navigate(-1))}>
            <span className="dsx-back-icon">
                <ArrowLeft size={15} strokeWidth={2.4} />
            </span>
            <span className="dsx-back-label">Back</span>
        </button>
    )
}

export default BackButton
