import React from 'react';

const InfoBar = (props) => {
    return (
        <div className={'infoTable'}>
            <span>X: {props.pos.x} : Y: {props.pos.y}</span>
            <span>{props.down ? 'Нажато' : 'Отжато'}</span>
        </div>
    );
};

export default InfoBar;