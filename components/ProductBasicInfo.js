import { useState, useEffect } from "react";
import {Modal, Row, Col, Button, Form, Image, Spinner } from 'react-bootstrap';

import MultimediaUploader from './MultimediaUploader';

import httpClient from '../utilities/http-client';

import Loader from './loader/loader';

import styles from '../styles/ProductBasicInfo.module.css';

const ProductBasicInfo = (props) => {
    const { productObj, setProductObj } = props;

    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(async () => {

	}, []);

    //functions
    const _handleSubmitBasicInfo = async () => {

		setIsLoading(true)

		let res;
		const {id, urlImageVideoPresentation, author, price, title, describtion, history} = productObj;
		const payload = {
			id: id,
			urlImageVideoPresentation: urlImageVideoPresentation,
			author: author,
			contract_price: price,
			title: title,
			describtion: describtion,
			history: history
		}

		try {
			res = await httpClient.post('/InsertProducts/Update', payload)
		} catch (error) {
			return console.error(error)
		}

		// TODO manage statuses
		if (res.status === 200) {
			console.log("XXXX", res.data)
			setProductObj(res.data)
		}

		setIsLoading(false)
	}

    //render functions


    
    //TODO add prop that differentiates between video and img upl
    return (
        <div className={styles.inputCard}>
            <h2 className={styles.sectionTitle}>Basic info</h2>
            <Loader show={isLoading}>
                <Form>

                    <Form.Group controlId="formTitle">
                        <Form.Label>Title of the NFT</Form.Label>
                        <Form.Control
                            name="title"
                            type="text"
                            placeholder="Enter the title"
                            value={productObj ? productObj.title : ""}                                                         
                            onChange={e => setProductObj({...productObj, title: e.target.value})}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{isTouched && errors?.title}</Form.Control.Feedback>
                        <Form.Text className="text-muted">(This will be the main title of the NFT)</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formAuthor">
                        <Form.Label>Author</Form.Label>
                        <Form.Control value={productObj ? productObj.author : ""} onChange={e => setProductObj({...productObj, author: e.target.value})} placeholder="Enter the author" />
                        <Form.Control.Feedback type="invalid">{isTouched && errors?.author}</Form.Control.Feedback>
                        <Form.Text className="text-muted">(The author of the art piece)</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control value={productObj ? productObj.price : ""} onChange={e => setProductObj({...productObj, price: e.target.value})} as="input" placeholder="110" />
                        <Form.Control.Feedback type="invalid">{isTouched && errors?.price}</Form.Control.Feedback>
                        <Form.Text className="text-muted">(The price of the art piece in ETH)</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control value={productObj ? productObj.describtion : ""} onChange={e => setProductObj({...productObj, describtion: e.target.value})} as="textarea" placeholder="Write your description here...." />
                        <Form.Control.Feedback type="invalid">{isTouched && errors?.description}</Form.Control.Feedback>
                        <Form.Text className="text-muted">(The description of the art piece)</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formHistory">
                        <Form.Label>History</Form.Label>
                        <Form.Control value={productObj ? productObj.history : ""} onChange={e => setProductObj({...productObj, history: e.target.value})} as="textarea" placeholder="Write the history of the NFT here...." />
                        <Form.Control.Feedback type="invalid">{isTouched && errors?.history}</Form.Control.Feedback>
                        <Form.Text className="text-muted">(The history of the art piece)</Form.Text>
                    </Form.Group>

                    <MultimediaUploader
                        mediaLabel={"urlImageVideoPresentation"}
                        mediaType={"image"}
                        mediaUrl={productObj ? productObj.urlImageVideoPresentation : ""}
                        productObj={productObj ? productObj : ""}
                        setProductObj={setProductObj}
                        nftTitle={productObj ? productObj.title : ""}
                    />

                </Form>
            </Loader>
            {!isLoading ? (<Button variant="success" onClick={() => _handleSubmitBasicInfo()}>Save Data</Button>) : (<Button variant="success" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</Button>)}
        </div>
    )
}

export default ProductBasicInfo;