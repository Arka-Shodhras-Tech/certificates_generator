import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Testing } from './testing';
import { Certificate } from '../student/certificate';

export const StudentRequest = () => {
    const [data, setData] = useState([]);
    const [approve, setApprove] = useState(false);
    const [user,setUser]=useState(
        {
            name:"",
            course:"",
            mail:""
        }
    )

    useEffect(() => {
        axios.post(process.env.REACT_APP_database + "/students")
            .then((result) => {
                setData(result.data);
            });
    }, []);

    const handleApprove = () => {
        setApprove(true);
    };

    const handleArchive = () => {
        // Logic for archiving a request
    };

    const handleReject = () => {
        // Logic for rejecting a request
    };

    return (
        <>
        <Testing/>
            {approve || data.map((val, index) => (
                <Card key={index}>
                    <Card.Header as="h5">Request for certificate</Card.Header>
                    <Card.Body>
                        <Card.Title>{"Request from " + val.Name}</Card.Title>
                        <Card.Text>
                            {"I want certificate from this course "}
                            <strong>{val.Course}</strong>
                        </Card.Text>
                        <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
                            <Button variant="success" onClick={handleApprove} onClickCapture={() => setUser(val1 => ({ ...val1, name: val.Name,course:val.Course,mail:val.Gmail }))}>Approve</Button>
                            <Button variant="warning" onClick={handleArchive}>Archive</Button>
                            <Button variant="danger" onClick={handleReject}>Reject</Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
            {approve && <Certificate name={user.name} course={user.course} mail={user.mail}/>}
        </>
    );
};
