import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
export const Rejects = (data) => {
    const toast=useToast();
    const handleArchive = async(mail,course) => {
        await axios.post(process.env.REACT_APP_database + "/archive"+"/"+mail+"/"+course)
          .then((res) =>{
            if(res.data){
                toast({ title: "Arcived", status: 'warning', position: "bottom-right", isClosable: true })
                window.location.reload()
            }
            else{
                toast({ title: "Try again", status: 'error', position: "bottom-left", isClosable: true })
            }
          }).catch((e) => console.log(e))
    };

    const handleReject = async(mail,course) => {
        await axios.post(process.env.REACT_APP_database + "/delete"+"/"+mail+"/"+course)
          .then((res) => {
            if(res.data){
                toast({ title: "deleted", status: 'warning', position: "bottom-right", isClosable: true })
                window.location.reload()
            }
            else{
                toast({ title: "Try again", status: 'error', position: "bottom-left", isClosable: true })
            }
          }).catch((e) => console.log(e))
    };

    return (
        <>
            {data.data.map((val, index) => (
                val?.Reject&&<Card key={index}>
                    <Card.Header as="h5">Request for certificate</Card.Header>
                    <Card.Body>
                        <Card.Title>{"Request from " + val.Name}</Card.Title>
                        <Card.Text>
                            {"I want certificate from this course "}
                            <strong>{val.Course}</strong>
                        </Card.Text>
                        <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
                            <Button variant="warning" onClick={()=>handleArchive(val.Gmail,val.Course)}>Archive</Button>
                            <Button variant="danger" onClick={()=>handleReject(val.Gmail,val.Course)}>Delete</Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </>
    );
};
