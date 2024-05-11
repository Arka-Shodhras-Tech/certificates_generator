import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Image from './certificate.png'
import Row from 'react-bootstrap/Row';

export const Certificates = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        axios.post(process.env.REACT_APP_database + '/retrivepdffrommongo')
            .then((res) => {
                console.log(res.data)
                setData(res.data)
            }).catch((e) => console.log(e))
    }, [])
    return (
        <div style={{width:"100%",display:'flex',justifyContent:"center"}}>
            <div style={{width:"90%",marginTop:"10vh"}}>
            <Row xs={1} md={3} className="g-4">
                {data?.details?.map((val, idx) => (
                    <Col key={idx}>
                        <Card>
                            <Card.Img src={Image} style={{height:"20vh"}}/>
                            <Card.Body style={{textAlign:"center"}}>
                                <Card.Title>{val?.Gmail}</Card.Title>
                                <Card.Text >
                                    <a href={val.Link} target="_blank" style={{color:"blue"}}>view</a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            </div>
        </div>
    )
}