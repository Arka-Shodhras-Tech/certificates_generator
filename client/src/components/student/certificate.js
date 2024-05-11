import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import { toPng } from 'html-to-image';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import certificateImage from "./certificate.png";

export const Certificate = ({ name, course, mail }) => {
    const [load, SetLoad] = useState(true)
    const toast = useToast();
    const [loading, SetLoading] = useState(false)
    const nav=useNavigate()
    const queryParams = new URLSearchParams(window.location.search);
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
                formData.append('name',name)
                formData.append('course',course)
                formData.append('mail',mail)
                await axios.post(process.env.REACT_APP_database + "/storepdf", formData)
                    .then(async (res) => {
                        if (res.data.link) {
                            await axios.post(process.env.REACT_APP_database + "/storepdftomongo", { mail, link: res.data.link })
                                .then(async (res1) => {
                                    if (res1.data) {
                                        await axios.post(process.env.REACT_APP_database + "/approve" + "/" + mail + "/" + course)
                                            .then((res2) => {
                                                if (res2.data) {
                                                    queryParams.set("view", "requests")
                                                    nav({ search: queryParams.toString() })
                                                    toast({ title: "Approved", status: 'success', position: "bottom-right", isClosable: true })
                                                    window.open(res.data.link)
                                                    SetLoading(false)
                                                }
                                            }).catch((e) => console.log(e))
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
                load && name&&mail&&<div id="htmlContent" style={{ width: "100%", height: "120vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
            {name&&mail&&<div style={{ width: "100%", height: "40vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <button onClick={GetCertificate} className="getcertificate">{loading ? "Sending..." : "Sent Certificate"}</button>
            </div>}
        </div>
    )
}