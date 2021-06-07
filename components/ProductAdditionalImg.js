import { useState, useEffect } from "react";
import {Modal, Row, Col, Button, Form, Image, Spinner } from 'react-bootstrap';
import settings from "../settings";
import httpClient from '../utilities/http-client';

import Loader from './loader/loader';
import MultimediaUploader from './MultimediaUploader';

import styles from '../styles/ProductAdditionalImg.module.css';

const ProductAdditonalImg = (props) => {
    const { productObj, setProductObj } = props;

    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errors, setErrors] = useState(null);
    const [newImgTitle, setNewImgTitle] = useState(null);
    const [newImgTag, setNewImgTag] = useState(null);
    const [newImgDesc, setNewImgDesc] = useState(null);

    useEffect( () => {

	}, []);

    //functions
    const _handleResetImg = e => {
		//empty the FileList every time you click on choose file
		e.target.value = "";
	};

    const _handleSubmitImage = async () => {

        console.log("I dati da inviare:", productObj.imagesProduct);

        const {id, descriptionImage, tag, titleImage, url} = productObj.imagesProduct;

        const payload = {
            productsId: productObj.id,
            titleImage: newImgTitle,
            descriptionImage: newImgDesc,
            url: url,
            tag: tag
        }

        try {
            const resImageUpl = await httpClient.post("/InsertProducts/InsertUpdateImage", payload)
            console.log("RES IMGO UPPL", resImageUpl);
		} catch (error) {
            console.error("ERROR", error.response.status)
            setErrors({ apiCall: `Error ${error.response.status}: ${error.response.data.error}` })
            setIsLoading(false);
            return
		}

    }

    const _handleDeleteImage = async (e, imgId) => {
        e.preventDefault()

        const currentUrl = productObj.imagesProduct.url;
        let choice = confirm(`Are you sure you want to delete this image?`)
        console.log("[*] Deleting:", imgId  )

        if (choice === false) return;

        // return // TODO implement the delete for this new image management

        let productObjClone = {...productObj};
        // productObjClone.imagesProduct = {
        //     descriptionImage: "",
        //     tag: "",
        //     titleImage: "",
        //     url: ""
        // }

        // const {id, descriptionImage, tag, titleImage, url} = productObj.imagesProduct;

        // const payload = {
        //     productsId: productObj.id,
        //     titleImage: titleImage,
        //     descriptionImage: descriptionImage,
        //     url: url,
        //     tag: tag
        // }

        const payload = JSON.stringify(imgId)

        try {
            console.log("image ", productObjClone)
            const res = await httpClient.post("/InsertProducts/RemoveImage", payload)
            console.log("VIDEO DELETION: ", res)
            setProductObj(productObjClone)
		} catch (error) {
            console.error("ERROR", error.response.status)
            setErrors({ apiCall: `Error ${error.response.status}: ${error.response.data.error}` })
            setIsLoading(false);
            return
		}

    }

    //render functions
    const renderSavedImages = () => {

        if (!productObj.imagesProduct) return

        const savedImagesJsx = productObj.imagesProduct.map( (imageProd, i) => {

            return (
                    <li className={styles.imageListLi}>
                        <img src={imageProd.url} />
                        <div>
                            <p><strong>Image #{i+1}</strong></p>
                            <p><strong>Title:</strong> {imageProd.titleImage}</p>
                            <p><strong>Tag:</strong> {imageProd.tag}</p>
                            <p><a onClick={(e) => _handleDeleteImage(e, imageProd.id)} href="#">delete</a></p>
                        </div>
                    </li>
            )
        })


        return (
            <ul className={styles.imageListUl}>
                {savedImagesJsx}
            </ul>
        )
    }

    if (!productObj) return "";
    if (!productObj.imagesProduct) {
        productObj.imagesProduct = {
            descriptionImage: "",
            tag: "",
            titleImage: "",
            url: ""
        }
    }

    return (
        <div className={styles.inputCard}>
            <h2 className={styles.sectionTitle}>Images</h2>
            <Loader show={isLoading}>
            <h3 className={styles.sectionSubTitle}>Saved Images</h3>

            <div>

                {renderSavedImages()}

            </div>

            <h3 className={styles.sectionSubTitle}>Upload new image</h3>
            <Form>

                <Form.Group controlId="formPrice">
                    <Form.Label>Image Title</Form.Label>
                    <Form.Control value={newImgTitle ? newImgTitle : ""} onChange={e => setNewImgTitle(e.target.value)  } as="input" placeholder="" />
                    <Form.Control.Feedback type="invalid">{isTouched && errors?.imgDescription}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Image Description</Form.Label>
                    <Form.Control value={newImgDesc ? newImgDesc : ""} onChange={e => setNewImgDesc( e.target.value ) } as="textarea" placeholder="Write your image description here...." />
                    <Form.Control.Feedback type="invalid">{isTouched && errors?.description}</Form.Control.Feedback>
                </Form.Group>
                
                <MultimediaUploader 
                    mediaLabel={"imagesProduct.url"} 
                    mediaType="image" 
                    mediaUrl={productObj.imagesProduct ? productObj.imagesProduct.url : ""} 
                    productObj={productObj ? productObj : ""}        
                    setProductObj={setProductObj}
                    newImgTitle={newImgTitle}
                    newImgDesc={newImgDesc}
                />

            </Form>
            </Loader>
            {!isLoading ? (<Button variant="success" onClick={() => _handleSubmitImage()}>Save Data</Button>) : (<Button variant="success" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</Button>)}
            <Button className={styles.deleteMediaBtn} disabled={productObj.imagesProduct.url === ""} variant="danger" onClick={() => _handleDeleteImage()}>Delete Photo</Button>
        </div>
    )
}

export default ProductAdditonalImg;