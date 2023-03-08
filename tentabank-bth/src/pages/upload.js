import React, { useState } from "react";
import { useCookies } from "react-cookie";


const Upload = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [grade, setGrade] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [failedUpload, setFailedUpload] = useState(false);
  const [failedServer, setFailedServer] = useState(false);
  const [failedName, setFailedName] = useState(false)
  const [cookies, setCookies] = useCookies(["user"])
  const [check, setChecked] = useState(false);


  function checkData(){
    console.log(date)
    if (!file || !name || !date || !grade){
      setFailedUpload(true)
      return false
    }
    if (name.length !== 6 || /[0-9]/.test(name.slice(0,2)) || !/[0-9]/.test(name.slice(2,6))){
      setFailedName(true)
      return false
    }
  }

  const handleUpload = () =>{
    setUploaded(!uploaded)
  } 

  function reset(){
    setFailedName(false)
    setFailedServer(false)
    setFailedUpload(false)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    reset()
    setChecked(checkData())
    if (!check){
      return
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("date", date);
    formData.append("grade", grade);
    formData.append("user_id", cookies.user_id)

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setFailedUpload(true);
        throw new Error("Upload failed");
      }else{
      handleUpload();
      }
    } catch (error) {
      setFailedServer(true);
      console.error(error);
    }
    
  };

  return (
    cookies.loggedIn?(
    <div className="upload-form">
      { uploaded ? (
        <div className="upload-success">
          <h3>Din tenta är nu inlämnad och väntar på att granskas</h3>
          <button onClick={handleUpload} className="submit-button">Ladda up igen</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".pdf" className="input-field" onChange={(e) => setFile(e.target.files[0])} />
          <input type="text" className="input-field" onChange={(e) => setName(e.target.value)} placeholder="Ma1435" />
          <input type="text" className="input-field" onChange={(e) => setDate(e.target.value)} placeholder="2023-02-02"/>
          <select className="dropdown" onChange={(e) => setGrade(e.target.value)}>
            <option value="">Betyg</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
          <button type="submit" className="submit-button">Ladda up</button>
        </form>
      )}
      {failedUpload === true && (<p className="errormessage">Fyll i alla fälten</p>)}
      {failedName === true && (<p className="errormessage">Ogiltig kurskod</p>)}
      {failedServer === true && (<p className="errormessage">Ingen kontakt med servern, försök igen om en stund</p>)}
    </div>
    ):(
      <div className="error-message">
        <h3>Du måste logga in för att kunna lämna in tentor</h3>
      </div>
    )
  );
};
export default Upload;
