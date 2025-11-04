import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = ({ onSave }) => {
  const sigCanvas = useRef();

 const saveSignature = () => {
    const dataURL = sigCanvas.current.toDataURL("image/png");
    onSave(dataURL);  // parent ko signature send karega
  };


   return (
    <div>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
      />
      <button onClick={saveSignature}>Save Signature</button>
    </div>
  );
};
export default SignaturePad;
