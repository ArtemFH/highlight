import Folder from "./Folder";
import InfoBar from "./InfoBar";
import {useCallback, useEffect, useState} from "react";

let root = document.getElementById('root');

function App() {
    const [start, setStart] = useState({page: {x: 0, y: 0}, client: {x: 0, y: 0}})
    const [pos, setPos] = useState({x: 0, y: 0})
    const [count, setCount] = useState(0)
    const [down, setDown] = useState(false)

    const pressCtrl = false //imitation

    useEffect(() => {
        window.addEventListener('mouseup', handleClick);
        window.addEventListener('mousedown', handleClick);
        if (down) window.addEventListener('mousemove', handleMove);
        return () => {
            window.removeEventListener('mouseup', handleClick);
            window.removeEventListener('mousedown', handleClick);
            if (down) window.removeEventListener('mousemove', handleMove);
        };
    }, [down]);

    const getAxis = (start, pos) => ({
        x: pos.x - start.x, y: pos.y - start.y
    })

    const getPosition = (start, {x, y}) => {
        let position = {};
        (x >= 0) ? position.left = start.x + 'px' : position.right = root.offsetWidth - start.x + 'px';
        (y >= 0) ? position.top = start.y + 'px' : position.bottom = root.offsetHeight - start.y + 'px';
        return position;
    }

    const setHighlight = (element, check) => {
        if (check) {
            element.classList.add('highlight');
            setCount(+count)
        } else element.classList.remove('highlight')
    }

    const highlight = (start, current, element, axis) => {
        const ElementRect = element.getBoundingClientRect()
        if (axis.x >= 0) {
            if (axis.y >= 0) {
                if ((start.y <= ElementRect.bottom && current.y >= ElementRect.top) && (start.x <= ElementRect.right && current.x >= ElementRect.left)) setHighlight(element, true)
                else setHighlight(element, false)
            } else {
                if ((start.y >= ElementRect.top && current.y <= ElementRect.bottom) && (start.x <= ElementRect.right && current.x >= ElementRect.left)) setHighlight(element, true)
                else setHighlight(element, false)
            }
        } else {
            if (axis.y >= 0) {
                if ((start.y <= ElementRect.bottom && current.y >= ElementRect.top) && (start.x >= ElementRect.left && current.x <= ElementRect.right)) setHighlight(element, true)
                else setHighlight(element, false)
            } else {
                if ((start.y >= ElementRect.top && current.y <= ElementRect.bottom) && (start.x >= ElementRect.left && current.x <= ElementRect.right)) setHighlight(element, true)
                else setHighlight(element, false)
            }
        }
    }

    const handleClick = useCallback(e => {
        let coordinates = {
            page: {x: e.pageX, y: e.pageY},
            client: {x: e.clientX, y: e.clientY}
        }
        if (e.type === "mousedown") {
            setDown(!down)
            setCount(0)
            const axis = getAxis(start.client, coordinates.client)
            Array.prototype.map.call(document.getElementsByClassName('folder'), (element) => highlight(coordinates.client, coordinates.client, element, axis))
            setStart({page: {x: e.pageX, y: e.pageY}, client: {x: e.clientX, y: e.clientY}})
        } else if (e.type === "mouseup") {
            setDown(down)
        }
    }, [])

    const handleMove = useCallback(e => {
        let coordinates = {
            page: {x: e.pageX, y: e.pageY},
            client: {x: e.clientX, y: e.clientY}
        }
        const axis = getAxis(start.client, coordinates.client)
        const position = getPosition(start.page, axis)
        const size = {width: Math.abs(axis.x) + 'px', height: Math.abs(axis.y) + 'px'}
        const style = {...position, ...size}
        Array.prototype.map.call(document.getElementsByClassName('folder'), (element) => highlight(start.client, coordinates.client, element, axis))
        document.getElementById('select').setAttribute('style', Object.keys(style).map((i) => `${i}: ${style[i]}`).join('; '))
        setPos(coordinates.page)
    }, [start])

    return (<>
        {down && <div className={'select'} id={'select'}/>}
        <div className={'main'}>{[...Array(200)].map((i, key) => <Folder id={key} key={key}/>)}</div>
        <InfoBar pos={pos} down={down} count={count}/>
    </>);
}

export default App;
