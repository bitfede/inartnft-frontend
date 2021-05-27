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
    const [docsToEncrypt, setDocsToEncrypt] = useState({doc1: null, doc2: null, doc3: null, doc4: null});

    useEffect(async () => {
        if (!productObj.documentsEncrypted) {
            // setProductObj
        }

        
	}, []);

    //functions
    const _handleAddEncryptedDocs = (e) => {

        //delete current docs

        //add new docs
    }

    const _handleSubmitEncryptDocs = async () => {

        console.log('submittin encrypt doc')
	}

    //render functions

    return (
        <div className={styles.inputCard}>
            <h5 className={styles.sectionh5Title}>Edit encrypted documents</h5>
            <Loader show={isLoading}>
            <Form>
                <Form.Group controlId="formDoc1">
                    <Form.File
                        accept={"application/pdf,image/*,video/*"}
                        onClick={e => console.log(e)}
                        onChange={e => _handleAddEncryptedDocs(e)}
                        id="nftDocumentsForm1"
                        label="NFT Encrypted Document 1"
                    />
                    {}
                </Form.Group>

                <Form.Group controlId="formDoc2">
                    <Form.File
                        accept={"application/pdf,image/*,video/*"}
                        onClick={e => console.log(e)}
                        onChange={e => _handleAddEncryptedDocs(e)}
                        id="nftDocumentsForm2"
                        label="NFT Encrypted Document 2"
                    />
                </Form.Group>

                <Form.Group controlId="formDoc3">
                    <Form.File
                        accept={"application/pdf,image/*,video/*"}
                        onClick={e => console.log(e)}
                        onChange={e => _handleAddEncryptedDocs(e)}
                        id="nftDocumentsForm3"
                        label="NFT Encrypted Document 3"
                    />
                </Form.Group>

                <Form.Group controlId="formDoc2">
                    <Form.File
                        accept={"application/pdf,image/*,video/*"}
                        onClick={e => console.log(e)}
                        onChange={e => _handleAddEncryptedDocs(e)}
                        id="nftDocumentsForm4"
                        label="NFT Encrypted Document 4"
                    />
                </Form.Group>
            </Form>
            </Loader>
            {!isLoading ? (<Button variant="success" onClick={() => _handleSubmitEncryptDocs()}>Save Data</Button>) : (<Button variant="success" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</Button>)}
        </div>
    )
}

export default ProductBasicInfo;