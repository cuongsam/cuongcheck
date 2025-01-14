import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getData, postData } from "../../../utils/api";
import useFetch from "../../../hooks/useFetch";
import { Context } from "../../../utils/AppContext";

export default function PracticeArea ({closeModal, lesson}) {
    const canvasRef  = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const [sampleImage, setSampleImage] = useState('');
    const [penColor, setPenColor] = useState('#ff0000');
    const [penSize, setPenSize] = useState(5);
    const [lastTime, setLastTime] = useState(0);
    const [lastLineWidth, setLastLineWidth] = useState(1);
    const [practiceHistories, setPracticeHistories] = useState(null);
    const [triggerHistory, setTriggerHistory] = useState(1);
    const [updateHistory, setUpdateHistory] = useState(null);
    const { loading, setLoading } = useContext(Context)
    const [shareAfterSave, setShareAfterSave] = useState(false)
    const [isModalShareOpen, setIsModalShareOpen] = useState(false);
    const [cavasSrc, setCavasSrc] = useState(null);

    const [shareData, setShareData] = useState({
        title: '',
        content: '',
        feeling: '',
    });

    const colors = [
        '#000000',
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#00ffff',
        '#ff00ff',
    ]

    const sizes = [
        3, 5, 7, 10, 12
    ]

    useEffect(() => {
        (async () => {
            let data = await getData(`user/practice-histories?lesson_id=${lesson.id}`)
            setPracticeHistories(data)
        })()
    }, [triggerHistory])

    useEffect(() => {
        setSampleImage(lesson.lesson_samples[0].thumbnail)
        setPenSize(sizes[0])
        setPenColor(colors[0])
    }, [lesson]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = penColor; 
        context.lineWidth = penSize; 
    }, [penColor, penSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        const backgroundImage = new Image();
        backgroundImage.src = sampleImage;
        backgroundImage.onload = () => {
            if (!updateHistory) {
                context.globalAlpha = 0.3;
            }

            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        };
        context.globalAlpha = 1.0;
    }, [sampleImage]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setLastPosition({ x: offsetX, y: offsetY });
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const currentTime = Date.now();
        const { offsetX, offsetY } = e.nativeEvent;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);

        const timeDiff = currentTime - lastTime;
        const distance = Math.sqrt(Math.pow(offsetX - lastPosition.x, 2) + Math.pow(offsetY - lastPosition.y, 2));
        const speed = distance / timeDiff;
        let newLineWidth = Math.max(0.1, penSize / (speed + 0.2));

        context.lineWidth = lastLineWidth + (newLineWidth - lastLineWidth) * 0.2;

        context.lineTo(offsetX, offsetY);
        context.stroke();
        context.closePath();

        setLastLineWidth(context.lineWidth)
        setLastPosition({ x: offsetX, y: offsetY });
        setLastTime(currentTime)
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleUpdateHistory = (history) => {
        if (history.id != updateHistory && confirm('Are you sure you want to update the history')) {
            setUpdateHistory(history.id)
            setSampleImage(history.image)
        }
    }

    const handleSelectSampleImage = (imageurl) => {
        if (imageurl != sampleImage && confirm('Are you sure you want to change the sample image')) {
            setSampleImage(imageurl)
            setUpdateHistory(null)
        }
    }

    const handleClearCanvas = () => {
        if (confirm('Are you sure you want to clear the canvas')) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            context.clearRect(0, 0, canvas.width, canvas.height);
            const backgroundImage = new Image();
            backgroundImage.src = sampleImage; 
            backgroundImage.onload = () => {
                if (!updateHistory) {
                    context.globalAlpha = 0.3;
                }

                context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            };
            context.globalAlpha = 1.0;
        }
    }

    const postCanvasImage = async () => {
        setLoading(true)
        const canvas = canvasRef.current;

        canvas.toBlob(async (blob) => {
        const formData = new FormData();
          formData.append('image', blob, 'canvas-image.png');
          formData.append('lesson_id', lesson.id);
          formData.append('share_after_save', shareAfterSave);

          if (updateHistory) {
            formData.append('practice_history_id', updateHistory);
          }

          let res = await postData('user/save-practice', formData)

          if (res.success) {
            setTriggerHistory(triggerHistory + 1)
            setLoading(false)
            setUpdateHistory(res.data.id)
            setSampleImage(res.data.image)
            setShareAfterSave(false)
          }
        }, 'image/png');
    };

    const handleRemovePractice = async (history) => {
        if (confirm('Are you sure you want to remove this practice history')) {
            await postData(`user/remove-practice-history`, {history_id: history.id})
            setTriggerHistory(triggerHistory + 1)

            if (history.id == updateHistory) {
                setUpdateHistory(null)
                setSampleImage(lesson.lesson_samples[0].thumbnail)
            }
        }
    }

    const handleShare = () => {
        const canvas = canvasRef.current;
        const canvasDataUrl = canvas.toDataURL("image/png");
        setCavasSrc(canvasDataUrl);
        setIsModalShareOpen(true);
    };

    const submitShare = async () => {
        setLoading(true);
        const canvas = canvasRef.current;
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("image", blob, "canvas-image.png");
            formData.append("lesson_id", lesson.id);
            formData.append("title", shareData.title);
            formData.append("content", shareData.content);
            formData.append("feeling", shareData.feeling);
            formData.append("share_after_save", true);
            const res = await postData("user/save-practice", formData);
            if (res && res.success) {
                alert(
                    "The Post Has Been Sent To The Admin For Review, Please Wait!"
                );
                setIsModalShareOpen(false);
                setTriggerHistory(triggerHistory + 1);
            }
            setLoading(false);
        }, "image/png");
    
    };

    return (
        <>
            <div className="container profile-page" id="pacticeAreaContainer">
                <button type="button" className="btn-close" onClick={closeModal}></button>
                <div className="row">
                    <div className="col-lg-12">
                        <h4 className="blog-details-title">Practice: { lesson?.title }</h4>
                    </div>
                </div>
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-4">
                        <div className="widget-sidber py-3">
                            <div className="widget-category">
                                <h3 className="blog-details-title mt-3">Samples:</h3>
                                <div className="previewSamples">
                                    {
                                        lesson?.lesson_samples?.map((sample, index) => (
                                            <img key={index} className={sample.thumbnail == sampleImage ? 'selected' : ''} onClick={() => handleSelectSampleImage(sample.thumbnail)} src={sample.thumbnail} alt="Sample" />
                                        ))
                                    }
                                </div>

                                <h3 className="blog-details-title">Color:</h3>
                                <div className="colors">
                                    {
                                        colors.map((color, index) => (
                                            <div key={index} className={color == penColor ? 'color-item selected' : 'color-item'} style={{ backgroundColor: color }} onClick={() => setPenColor(color)}></div>
                                        ))
                                    }
                                </div>

                                <h3 className="blog-details-title">Size:</h3>
                                <div className="sizes">
                                    {
                                        sizes.map((size, index) => (
                                            <div key={index} className={size == penSize? 'sizes-item selected mb-3' :'sizes-item mb-3'} onClick={() => setPenSize(size)} style={{ height: `${size}px` }}></div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* Main Content */}
                    <div className="col-md-8">
                        <div className="widget-sidber">
                            
                            <canvas
                                id="practiceArea"
                                ref={canvasRef}
                                width={600}
                                height={500}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                            />

                            <div className="submit-button mt-3" style={{'width': '150px', 'margin': '0 auto'}}>
                                <button type="button" onClick={handleClearCanvas}>Clear</button>
                            </div>
                        </div>

                        <div className="historiesList">
                            <div className="initHistory">
                            {
                                practiceHistories && practiceHistories.map(history => {

                                    return (
                                        <div key={history.id} className={ updateHistory == history.id ? "historyItem selected" : "historyItem"}>
                                            <button type="button" className="btn-close" onClick={() => handleRemovePractice(history)}></button>
                                            <img src={history.image} alt="History" onClick={() => handleUpdateHistory(history)} />
                                            <p>{ history.created_at.split('T')[0] } : { history.created_at.split('T')[1].split('.')[0] }</p>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4">
                        <div className="submit-button">
                            <button type="button" onClick={postCanvasImage}>{ updateHistory ? 'Update' : 'Save' }</button>
                        </div>
                    </div>

                    <div className="col-lg-4 offset-4">
                        <div className="submit-button classInfo">
                            <button type="button" onClick={handleShare}>Share</button>
                        </div>
                    </div>
                </div>
            </div>
            
           
            
                { isModalShareOpen && (
                <div className="myModal">
                    <div className="initModal">
                    <div className="container profile-page" id="pacticeAreaContainer">
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                        <h3>Posts are shared</h3>
                        {cavasSrc && (
                            <div>
                                <img
                                    src={cavasSrc}
                                    alt="Your Drawing"
                                    style={{
                                        width: "30%",
                                        borderRadius: "4px",
                                        border: "2px solid #ccc",
                                        marginBottom: "20px",
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            <label>Title</label>
                            <input
                                type="text"
                                value={shareData.title}
                                onChange={(e) =>
                                    setShareData({
                                        ...shareData,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label>Feeling</label>
                            <textarea
                                rows="3"
                                value={shareData.feeling}
                                onChange={(e) =>
                                    setShareData({
                                        ...shareData,
                                        feeling: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label>Content:</label>
                            <textarea
                                rows="3"
                                value={shareData.content}
                                onChange={(e) =>
                                    setShareData({
                                        ...shareData,
                                        content: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                className="cancel"
                                onClick={() => setIsModalShareOpen(false)}
                            >
                                Cancel
                            </button>
                            <button onClick={submitShare}>Share</button>
                        </div>
                    </div>
                </div>
                </div>
            )}
        
        </>
    )
}
