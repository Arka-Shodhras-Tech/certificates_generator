import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import './student.css';
const Request = () => {
    const [name, SetName] = useState();
    const [course, Setcourse] = useState();
    const [email, SetEmail] = useState("");
    const time = new Date().toDateString()
    const toast = useToast();
    const Handleclick = async () => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        try {
            if (emailRegex.test(email)) {
                const res = await axios.post(process.env.REACT_APP_database + "/signup/" + email + "/" + name + "/" + course + "/" + time)
                {
                    if(res.data.message){
                        toast({ title: "Already Exist", status: 'warning', position: "bottom-right", isClosable: true })
                    }
                    else if(res.data.data){
                        toast({ title: "Sent data Successfully", status: 'success', position: "bottom-right", isClosable: true })
                        setTimeout(() => {
                            // window.location.href="certificate"
                        }, 1500);
                    }
                    else {
                        toast({ title: "Try again", status: "error", position: "bottom-left", isClosable: true })
                    }
                }
            }
            else {
                toast({ title: "Invalid Email", status: 'error', position: "bottom-right", isClosable: true })
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <div className="register-body">
                <div className="register-container">
                    <div className="register-header">
                        <h2>Request For Certificate</h2>
                    </div>
                    <div className="register-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="G-mail"
                                name="email"
                                value={email}
                                onChange={(e) => SetEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Full Name"
                                name="name"
                                value={name}
                                onChange={(e) => SetName(e.target.value.toUpperCase())}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="regd">Course</label>
                            <input
                                type="text"
                                id="regd"
                                placeholder="Course"
                                name="regd"
                                value={course}
                                onChange={(e) => Setcourse(e.target.value.toUpperCase())}
                            />
                        </div>
                        <div className="form-group" style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <button type="button" onClick={Handleclick}>
                                <b>Sent</b>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Request;