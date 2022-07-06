import React from 'react';

const InfoBar = (props) => {
    return (
        <div className={'infoTable'}>
            <span>X: {props.pos.x} : Y: {props.pos.y}</span>
            <span>Состояние клика: {props.down ? 'Нажато' : 'Отжато'}</span>
            <span>Выбранно: {props.count}</span>
        </div>
    );
};

export default InfoBar;