import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Certificate } from '../student/certificate';
import { useToast } from '@chakra-ui/react';
import { Archives } from './archive';
import { Rejects } from './reject';
import { useNavigate } from 'react-router-dom';
export const StudentRequest = () => {
    const [data, setData] = useState([]);
    const [length, setLength] = useState({
        request: 0,
        archive: 0,
        reject: 0,
        total: 0
    })
    const [approve, setApprove] = useState(false);
    const [user, setUser] = useState(
        {
            name: "",
            course: "",
            mail: ""
        }
    )
    const queryParams = new URLSearchParams(window.location.search);
    const nav = useNavigate()
    let set = queryParams?.get("view");
    if (!set) {
        set = "requests"
    }
    const toast = useToast();

    useEffect(() => {
        axios.post(process.env.REACT_APP_database + "/students")
            .then((result) => {
                setData(result.data);
                setLength(val => ({ ...val, total: result.data.length }))
                setLength(val => ({ ...val, Pending: data.filter((val) => val.Pending === true).length }))
                setLength(val => ({ ...val, archive: data.filter((val) => val.Archive === true).length }))
                setLength(val => ({ ...val, reject: data.filter((val) => val.Reject === true).length }))
            });
    }, [length.total, length.request]);

    const handleApprove = () => {
        queryParams.set("view", "approve")
        nav({ search: queryParams.toString() })
        setApprove(true);
    };

    const handleArchive = async (mail, course) => {
        await axios.post(process.env.REACT_APP_database + "/archive" + "/" + mail + "/" + course)
            .then((res) => {
                if (res.data) {
                    toast({ title: "Arcived", status: 'warning', position: "bottom-right", isClosable: true })
                    window.location.reload()
                }
                else {
                    toast({ title: "Try again", status: 'error', position: "bottom-left", isClosable: true })
                }
            }).catch((e) => console.log(e))
    };

    const handleReject = async (mail, course) => {
        await axios.post(process.env.REACT_APP_database + "/reject" + "/" + mail + "/" + course)
            .then((res) => {
                if (res.data) {
                    toast({ title: "Rejected", status: 'warning', position: "bottom-right", isClosable: true })
                    window.location.reload()
                }
                else {
                    toast({ title: "Try again", status: 'error', position: "bottom-left", isClosable: true })
                }
            }).catch((e) => console.log(e))
    };
    return (
        <>
            <div style={{ display: 'flex', justifyContent: "space-evenly", height: '10vh', alignItems: "center" }}>
                <Button onClickCapture={() => { setApprove(false); queryParams.set("view", "requests"); nav({ search: queryParams.toString() }) }}>Requests :: {length.Pending}</Button>
                <Button onClickCapture={() => { setApprove(false); queryParams.set("view", "archives"); nav({ search: queryParams.toString() }) }}>Archives :: {length.archive}</Button>
                <Button onClickCapture={() => { setApprove(false); queryParams.set("view", "rejects"); nav({ search: queryParams.toString() }) }}>Rejects :: {length.reject}</Button>
                <h6>Total:: {length.total}</h6>
            </div>
            {approve || set === "requests" && data.map((val, index) => (
                <Card key={index}>
                    <Card.Header as="h5">Request for certificate</Card.Header>
                    <Card.Body>
                        <Card.Title>{"Request from " + val.Name}</Card.Title>
                        <Card.Text>
                            {"I want certificate from this course "}
                            <strong>{val.Course}</strong>
                        </Card.Text>
                        <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
                            <Button variant="success" onClick={handleApprove} onClickCapture={() => setUser(val1 => ({ ...val1, name: val.Name, course: val.Course, mail: val.Gmail }))}>Approve</Button>
                            <Button variant="warning" onClick={() => handleArchive(val.Gmail, val.Course)}>Archive</Button>
                            <Button variant="danger" onClick={() => handleReject(val.Gmail, val.Course)}>Reject</Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
            {set === "archives" && <Archives data={data} />}
            {set === "rejects" && <Rejects data={data} />}
            {set==="approve" && <Certificate name={user.name} course={user.course} mail={user.mail} />}
        </>
    );
};
