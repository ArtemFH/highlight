import './app.css'
import React, {useEffect, useRef, useState} from 'react';

const Folder = (props) => {
    const element = useRef(null);
    const [rect, setRect] = useState({});
    useEffect(() => {
        setRect(element.current.getBoundingClientRect())
    }, [])

    return (<div className={'folder'} ref={element} id={props.id}>
        <div>
            <span style={{top: 0}}>{Math.round(rect.top)}</span>
            <span style={{left: 0}}>{Math.round(rect.left)}</span>
            <span style={{right: 0}}>{Math.round(rect.right)}</span>
            <span style={{bottom: 0}}>{Math.round(rect.bottom)}</span>
        </div>
    </div>);
};

export default Folder;