import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Certificate } from '../student/certificate';
import { useToast } from '@chakra-ui/react';

export const Archives = (data) => {
    const [approve, setApprove] = useState(false);
    const [user,setUser]=useState(
        {
            name:"",
            course:"",
            mail:""
        }
    )
    const toast=useToast();
    const handleApprove = () => {
        setApprove(true);
    };
    const handleArchive = async(mail,course) => {
        await axios.post(process.env.REACT_APP_database + "/pending"+"/"+mail+"/"+course)
          .then((res) =>{
            if(res.data){
                toast({ title: "Arcived", status: 'warning', position: "bottom-right", isClosable: true })
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
            else{
                toast({ title: "Try again", status: 'error', position: "bottom-left", isClosable: true })
            }
          }).catch((e) => console.log(e))
    };
    const handleReject = async(mail,course) => {
        await axios.post(process.env.REACT_APP_database + "/reject"+"/"+mail+"/"+course)
          .then((res) => {
            if(res.data){
                toast({ title: "Rejected", status: 'warning', position: "bottom-right", isClosable: true })
                window.location.reload()
            }
            else{
                toast({ title: "Try again", status: 'error', position: "bottom-left", isClosable: true })
            }
          }).catch((e) => console.log(e))
    };

    return (
        <>
            {approve || data.data.map((val, index) => (
                val?.Archive&&<Card key={index}>
                    <Card.Header as="h5">Request for certificate</Card.Header>
                    <Card.Body>
                        <Card.Title>{"Request from " + val.Name}</Card.Title>
                        <Card.Text>
                            {"I want certificate from this course "}
                            <strong>{val.Course}</strong>
                        </Card.Text>
                        <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
                            <Button variant="success" onClick={handleApprove} onClickCapture={() => setUser(val1 => ({ ...val1, name: val.Name,course:val.Course,mail:val.Gmail }))}>Approve</Button>
                            <Button variant="warning" onClick={()=>handleArchive(val.Gmail,val.Course)}>Request</Button>
                            <Button variant="danger" onClick={()=>handleReject(val.Gmail,val.Course)}>Reject</Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
            {approve && <Certificate name={user.name} course={user.course} mail={user.mail}/>}
        </>
    );
};
