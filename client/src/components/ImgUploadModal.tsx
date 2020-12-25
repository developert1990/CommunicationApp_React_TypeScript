import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Axios from 'axios';
import { API_BASE } from '../config';
import { initialAppStateType } from '../store';
import { useSelector } from 'react-redux';

export interface ImgUploadModalPropsType {
    handleClose: () => void;
    setUserProfilePic: Dispatch<SetStateAction<string>>;
    userProfilePic: string;
}

export const ImgUploadModal: React.FC<ImgUploadModalPropsType> = ({ handleClose, setUserProfilePic, userProfilePic }) => {
    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinInfoStore;

    console.log('userProfilePic', userProfilePic)

    const [image, setImage] = useState("");
    const [cropper, setCropper] = useState<any>();
    const [uploadClickable, setUploadClickable] = useState(false);
    const onChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;

            // 올린 파일이 jpg or png 일경우에만 진행되고 아니면 else 에서 alert 와 버튼 클릭을 막는다.
            if (files["0"].type === "image/png" || files["0"].type === "image/jpeg") {
                const reader = new FileReader();
                reader.onload = () => {
                    setImage(reader.result as any);
                };
                reader.readAsDataURL(files[0]);
                setUploadClickable(true);
            } else {
                setImage("Can not use this file which is not image file...");
                alert("Image Type should be 'png' or 'jpg'.");
                setUploadClickable(false);
            }
        }

    };

    const getCropData = async () => {
        if (typeof cropper !== "undefined") {

            const canvas = cropper.getCroppedCanvas();
            if (canvas == null) {
                console.log("Upload fail.. Try again.")
            }

            canvas.toBlob(async (blob: string | Blob) => {
                const formData = new FormData();
                formData.append("croppedImage", blob);

                const { data } = await Axios.post(`${API_BASE}/upload/profilePicture/${signinInfo._id}/${userProfilePic}`, formData, {
                    // headers: { Authorization: `Hong ${signinInfo.token}` },
                    withCredentials: true,
                });
                // console.log('data: ', data)
                setUserProfilePic(data);
            });
            handleClose();
        }
    };


    return (
        <div>
            <Modal.Header closeButton>
                <Modal.Title>Upload a new Profile Photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="file" name="filePhoto" onChange={onChange} />
                <Cropper
                    // id="imagePreview"
                    style={{ height: "100%", width: "100%" }}
                    initialAspectRatio={1}
                    src={image}
                    viewMode={1}
                    guides={true}
                    rotatable={true}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    // checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                    </Button>
                <Button variant="primary" onClick={getCropData} disabled={!uploadClickable}>
                    Upload
                    </Button>
            </Modal.Footer>
        </div>
    )
}






