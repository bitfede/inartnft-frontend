import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {Modal, Row, Col, Button, Form, Image, Spinner } from 'react-bootstrap';
import httpClient from '../utilities/http-client';
import { convertToRaw, EditorState, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
const Editor = dynamic(() => import("react-draft-wysiwyg").then(mod => mod.Editor), { ssr: false });


import MultimediaUploader from './MultimediaUploader';
import Loader from './loader/loader';


import styles from '../styles/ProductBasicInfo.module.css';

let htmlToDraft = null;
if (typeof window === 'object') {
  htmlToDraft = require('html-to-draftjs').default;
}

const ProductBasicInfo = (props) => {
    const { productObj, setProductObj } = props;

    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errors, setErrors] = useState({});
    const [descriptionEditorState, setDescriptionEditorState] = useState(null);
    const [historyEditorState, setHistoryEditorState] = useState(null);


    useEffect(async () => {
        if (!productObj) return
        if (!productObj.describtion) {
            productObj.describtion = " ";
        }
        if (!productObj.history) {
            productObj.history = " ";
        }

        try {
            const htmlText = productObj.describtion;
            const blocksFromHtml = htmlToDraft(htmlText);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const descriptionRichText = EditorState.createWithContent(contentState);
            setDescriptionEditorState(descriptionRichText)
        } catch (err) {
            console.error(err)
        }

        try {
            const htmlText = productObj.history;
            const blocksFromHtml = htmlToDraft(htmlText);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const descriptionRichText = EditorState.createWithContent(contentState);
            setHistoryEditorState(descriptionRichText)
        } catch (err) {
            console.error(err)
        }

	}, [productObj]);

    //functions
    const _handleSubmitBasicInfo = async () => {

        setIsTouched(true);
        setIsLoading(true)

        const checksAreValid = _handleValidate()
        if (!checksAreValid) { return false}

        //setup hashconfig to extract content from editor   
        const hashConfig = {
            trigger: "#",
            separator: " ",
        };

        //get description from wysiwyg editor
        const contentBlocksRaw = convertToRaw(descriptionEditorState.getCurrentContent());
        const descriptionHtml = draftToHtml(contentBlocksRaw, hashConfig);

        //get history from wysiwyg editor
        const contentBlocksRaw2 = convertToRaw(historyEditorState.getCurrentContent());
        const historyHtml = draftToHtml(contentBlocksRaw2, hashConfig);

		let res;
		const {id, urlImageVideoPresentation, author, price, title, describtion, history} = productObj;
		const payload = {
			id: id,
			urlImageVideoPresentation: urlImageVideoPresentation,
			author: author,
			contract_price: price,
			title: title,
			describtion: descriptionHtml,
			history: historyHtml
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
        setIsTouched(false)
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

    const _handleValidate = () => {

        if (!productObj.title?.trim()) {
            setErrors({ title: "Missing title" });
            setIsLoading(false);
            alert("Title must not be left blank")
            return false;
        }

        if (!String(productObj.price)?.trim()) {
            setErrors({ price: "Missing price" });
            setIsLoading(false);
            alert("Price must not be left blank")
            return false;
        }


        if (!productObj.urlImageVideoPresentation?.trim()) {
            setErrors({ image: "Missing image" });
            setIsLoading(false);
            alert("Image must not be left blank")
            return false;
        }


        return true
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
                        <Editor
                            editorState={descriptionEditorState}
                            toolbarClassName={styles.rdwToolbarMain}
                            wrapperClassName="wrapperClassName"
                            editorClassName={styles.rdwEditorMain}
                            onEditorStateChange={newState => setDescriptionEditorState(newState)}
                            uploadEnabled={true}
                            uploadCallback={e => _handleTextEditorImgUpload(e)}
                            previewImage={true}
                        />
                        <Form.Control.Feedback type="invalid">{isTouched && errors?.description}</Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group controlId="formHistory">
                        <Form.Label>History</Form.Label>
                        <Editor
                            editorState={historyEditorState}
                            toolbarClassName={styles.rdwToolbarMain}
                            wrapperClassName="wrapperClassName"
                            editorClassName={styles.rdwEditorMain}
                            onEditorStateChange={newState => setHistoryEditorState(newState)}
                            uploadEnabled={true}
                            uploadCallback={e => _handleTextEditorImgUpload(e)}
                            previewImage={true}
                        />
                        <Form.Control.Feedback type="invalid">{isTouched && errors?.history}</Form.Control.Feedback>
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