import Folder from "./Folder";
import {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import InfoBar from "./InfoBar";

let root = document.getElementById('root');

function App() {
    const [start, setStart] = useState({page: {x: 0, y: 0}, client: {x: 0, y: 0}})
    const [pos, setPos] = useState({x: 0, y: 0})
    const [count, setCount] = useState(0)
    const [down, setDown] = useState(false)
    const [mesh, setMesh] = useState({x: 10, y: 10})

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

    useEffect(() => {
        document.getElementById('x').addEventListener("mousewheel", handleScroll('x'));
        document.getElementById('y').addEventListener("mousewheel", handleScroll('y'));
        return () => {
            document.getElementById('x').removeEventListener("mousewheel", handleScroll('x'));
            document.getElementById('y').removeEventListener("mousewheel", handleScroll('y'));
        };
    }, [])

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
        } else {
            element.classList.remove('highlight')
        }
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
            const elements = document.getElementsByClassName('highlight').length
            if (elements === 1) {
                [...document.getElementsByClassName('highlight')].forEach(function (element) {
                    setHighlight(element, false)
                });
            } else if (elements > 1) {
                Array.prototype.map.call(document.getElementsByClassName('folder'), (element) => highlight(coordinates.client, coordinates.client, element, axis))
            } else Array.prototype.map.call(document.getElementsByClassName('folder'), (element) => highlight(coordinates.client, coordinates.client, element, axis))
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
        setCount(document.getElementsByClassName('highlight').length)
        setPos(coordinates.page)
    }, [start])

    const handleScroll = useCallback(args => e => {
        if (args === 'x') {
            if (e.deltaY > 0 && mesh.x < 50) setMesh({...mesh, x: ++mesh.x})
            else if (e.deltaY < 0 && mesh.x > 5) setMesh({...mesh, x: --mesh.x})
        } else if (args === 'y') {
            if (e.deltaY > 0 && mesh.y < 50) setMesh({...mesh, y: ++mesh.y})
            else if (e.deltaY < 0 && mesh.y > 5) setMesh({...mesh, y: --mesh.y})
        }
        e.stopPropagation();
        e.preventDefault();
    }, [])

    return (<>
        {down && <div className={'select'} id={'select'}/>}
        <div className={'mesh'}>
            <input type={"number"} id={'x'} min={5} max={50} value={mesh.x} onInput={e => setMesh({...mesh, x: +e.target.value})}/>
            <input type={"number"} id={'y'} min={5} max={50} value={mesh.y} onInput={e => setMesh({...mesh, y: +e.target.value})}/>
        </div>
        <div className={'main'}>{[...Array(200)].map((i, key) => <Sizer mesh={{width: `${100 / mesh.x}%`, height: `${100 / mesh.y}%`}} key={key}><Folder id={key}/></Sizer>)}</div>
        <InfoBar pos={pos} down={down} count={count}/>
    </>);
}

export default App;

const Sizer = styled('div')`
  width: ${props => props.mesh.width};
  height: ${props => props.mesh.height};
`