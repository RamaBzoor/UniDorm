import { useState } from "react";
import Icons from "../../icons"; // Import the Icons object

const SubAr = () => {
  const [subText, setSubText] = useState("");

  return (
    <div className="sub">
      <img src={Icons.logo} alt="Logo" className="logo" />
      {/* <h3>اشترك</h3>
      <div>
        <input
          type="text"
          value={subText}
          onChange={(e) => setSubText(e.target.value)}
          placeholder="ادخل ايميلك"
        />
        <img src={Icons.send} alt="Send" />
      </div> */}
    </div>
  );
};

export default SubAr;
