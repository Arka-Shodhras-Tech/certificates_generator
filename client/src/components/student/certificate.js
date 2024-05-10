import { useState } from "react"
import certificateImage from "./certificate.png"
import { toPng } from 'html-to-image';
import axios from 'axios'
export const Certificate = ({ name, course, mail }) => {
    const [load, SetLoad] = useState(true)
    const [loading, SetLoading] = useState(false)
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const GetCertificate = async () => {
        SetLoading(true)
        const element = document.getElementById('htmlContent');
        toPng(element)
            .then(async (dataUrl) => {
                const formData = new FormData();
                const blob = await fetch(dataUrl).then(res => res.blob());
                formData.append("file", blob, 'image.png');
                await axios.post(process.env.REACT_APP_database + "/storepdf", formData)
                    .then(async (res) => {
                        if (res.data.link) {
                            await axios.post(process.env.REACT_APP_database + "/storepdftomongo", { mail, link: res.data.link })
                                .then((res1) => {
                                    if (res1.data) {
                                        window.open(res.data.link)
                                        SetLoading(false)
                                    }
                                }).catch((e) => console.log(e), SetLoading(false))
                        }
                    }).catch((e) => console.log(e), SetLoading(false))
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    return (
        <div>
            {load || <div style={{ width: "100%", height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h1>Please wait for certificate</h1>
            </div>}
            {
                load && <div id="htmlContent" style={{ width: "100%", height: "120vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img src={certificateImage} className="cerficateimage" />
                    <div className="certificatename">
                        <p1>{name}</p1>
                        <br />
                        <div>
                            <p2 >
                                <p>
                                    For successfully completing the {course} 
                                    course on 03/05/2024.
                                </p>
                            </p2>
                        </div>
                    </div>
                    <p className="certificateid">
                        {result}
                    </p>
                </div>
            }
            <div style={{ width: "100%", height: "40vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <button onClick={GetCertificate} className="getcertificate">{loading ? "Sending..." : "Sent Certificate"}</button>
            </div>
        </div>
    )
}