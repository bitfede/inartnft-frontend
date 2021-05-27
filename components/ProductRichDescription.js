import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {Modal, Row, Col, Button, Form, Image, Spinner } from 'react-bootstrap';
import httpClient from '../utilities/http-client';
import { convertToRaw, EditorState, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
// import htmlToDraft from 'html-to-draftjs';
const Editor = dynamic(() => import("react-draft-wysiwyg").then(mod => mod.Editor), { ssr: false });
// const htmlToDraft = dynamic(() => import("html-to-draftjs").then(mod => mod.htmlToDraft), { ssr: false });
// import MultimediaUploader from './MultimediaUploader';
import Loader from './loader/loader';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from '../styles/ProductRichDescription.module.css';

let htmlToDraft = null;
if (typeof window === 'object') {
  htmlToDraft = require('html-to-draftjs').default;
}

const ProductRichDescription = (props) => {
    const { productObj, setProductObj } = props;

    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errors, setErrors] = useState(null);
    const [editorState, setEditorState] = useState(null);

    console.log(editorState)

    useEffect( () => {
        if (!productObj) return

        const htmlText = productObj.documentsProduct.descriptionDocument;

        console.log("YOYO", htmlToDraft(htmlText))
        const blocksFromHtml = htmlToDraft(htmlText);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);

        setEditorState(editorState);


    }, [productObj])

    //functions
    const _handleSubmitRichDescription = async () => {
        
        setIsLoading(true);

        const hashConfig = {
            trigger: "#",
            separator: " ",
        };

        const contentBlocksRaw = convertToRaw(editorState.getCurrentContent());
        const markupHtml = draftToHtml(contentBlocksRaw, hashConfig);
        console.log("MARKUP", markupHtml);

        const payload = {
            productsId: productObj.id,
            titleDocuments: productObj.title,
            descriptionDocuments: markupHtml,
        };

        const res = await httpClient.post("/InsertProducts/InsertUpdateDocument", payload);
        //TODO Handle all statuses, 200, 400 etc

        console.log("POST DESCR LONG INFO", res);
        setIsLoading(false);

    }


	const _handleTextEditorImgUpload = async e => {
		const fileToUpload = e;

		const formData = new FormData();
		formData.append("image", fileToUpload);
		formData.append("tag", fileToUpload.name);
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};

		const response = await httpClient.post(`/Upload/UploadImage`, formData, config);
		console.log(response);

		const retVal = new Promise((resolve, reject) => {
			resolve({ data: { link: response.data.url } });
		});

		return retVal;
	};

    //render functions


    
    return (
        <div className={styles.inputCard}>
            <h2 className={styles.sectionTitle}>Basic info</h2>
            <Loader show={isLoading}>
                <Form>
                    <Editor
                        editorState={editorState}
                        toolbarClassName={styles.rdwToolbarMain}
                        wrapperClassName="wrapperClassName"
                        editorClassName={styles.rdwEditorMain}
                        onEditorStateChange={newState => setEditorState(newState)}
                        uploadEnabled={true}
                        uploadCallback={e => _handleTextEditorImgUpload(e)}
                        previewImage={true}
                    />
                </Form>
            </Loader>
            {!isLoading ? (<Button variant="success" onClick={() => _handleSubmitRichDescription()}>Save Data</Button>) : (<Button variant="success" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</Button>)}
        </div>
    )
}

export default ProductRichDescription;